package com.Lzo.BlackCatShop.servlet;

import com.Lzo.BlackCatShop.bean.Cart;
import com.Lzo.BlackCatShop.bean.Goods;
import com.Lzo.BlackCatShop.dao.CartDao;
import com.Lzo.BlackCatShop.dao.GoodsDao;
import com.Lzo.BlackCatShop.dao.UserDao;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@WebServlet({"/goods/addToCart"})
public class GoodsServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 获取session，此session不需要新建
        // 还是获取当前session，获取不到返回null
        Cookie[] cookies = req.getCookies();
        boolean cookieFlag = false;
        String username = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("username")) {
                    cookieFlag = true;
                    username = cookie.getValue();
                    break;
                }
            }
        }
        if (cookieFlag) {
            String servletPath = req.getServletPath();
            if ("/goods/addToCart".equals(servletPath)) {
                Map map = getAllGoods(req, resp, username, "search");
                doAddToCart(req, resp, map, username);
            }
        } else {
            // 跳转到登录页面
            resp.sendRedirect(req.getContextPath() + "/shopping/login.html");
        }
    }

    protected void doAddToCart(HttpServletRequest req, HttpServletResponse resp, Map map, String username) throws ServletException, IOException {
        String goodsNo = req.getParameter("goodsNo");
        String goodsQuantity = req.getParameter("goodsQuantity");
        CartDao cartDao = new CartDao();
        GoodsDao goodsDao = new GoodsDao();
        Goods oneGoods = goodsDao.getCartGoods(goodsNo);
        // 处理信息
        Map afterChangeMap = disposeInfo(goodsNo, map, goodsQuantity, oneGoods.getGoodsShop());
        // 根据编号获得
        int count = cartDao.doUpdate(username, afterChangeMap);
        if (count == 1) {
            UserDao userDao = new UserDao();
            String num = userDao.getGoodsNum(username);
            String nowNum = String.valueOf(Integer.parseInt(num) + 1);
            userDao.updateInfo(username, "updateNum", nowNum);
        } else {
            // 到另一个界面，提示删除失败
            resp.sendRedirect(req.getContextPath() + "/shopping/error.html");
        }
    }

    /**
     * 实现把数据库的数据传到前端的操作或者传给删除需要的操作
     *
     * @param req      请求
     * @param resp     响应
     * @param username 用户名用于查询
     * @param operate  哪个操作
     * @return 返回List数组或者null
     */
    private synchronized Map getAllGoods(HttpServletRequest req, HttpServletResponse resp, String username, String operate) throws ServletException, IOException {
        // 设置响应的类型和字符集
        resp.setContentType("text/html;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        // 集合存储数据
        Cart cart = new CartDao().getCartInfo(username);
        // 关于链表的顺序变化，我放在这一层操作
        // 搞一个集合存放取出来的Goods类 搞一个集合存放数量 搞一个集合存放选中状态
        // 集合的下标则对应相同的物品，此时再建立一个数组，我愿称其为“标杆”，它的作用是在上面三个集合的更上一层封装
        // 当我修改这个数组的第一个元素时，变化会影响到它下面的这三个数组
        List<String> shopList = cart.getShopList();
        List<String> surplusGoodsList = cart.getSurplusGoodsList();
        List<Goods> goodsList = new LinkedList<>();
        List<String> goodsListInCart = cart.getGoodsList();
        List<String> goodsQuantityList = cart.getGoodsQuantity();
        List<String> isSelectedList = cart.getIsSelected();
        int[] goodsIndexArr;
        if (shopList != null && surplusGoodsList != null && goodsListInCart != null && goodsQuantityList != null && isSelectedList != null) {
            goodsIndexArr = new int[cart.getGoodsList().size()];
            GoodsDao goodsDao = new GoodsDao();
            int i = 0;
            for (String goods : cart.getGoodsList()) {
                Goods oneGoods = goodsDao.getCartGoods(goods);
                goodsList.add(oneGoods);
                goodsIndexArr[i] = ++i;
            }
            if (operate.equals("refresh")) {
                JSONArray jsArr = new JSONArray();
                // 将五个集合转换为字符串
                String jsonShopList = JSON.toJSONString(shopList);
                String jsonGoodsList = JSON.toJSONString(goodsList);
                String jsonGoodsQuantityList = JSON.toJSONString(goodsQuantityList);
                String jsonIsSelectedList = JSON.toJSONString(isSelectedList);
                String jsonGoodsIndexArr = JSON.toJSONString(goodsIndexArr);
                jsArr.add(jsonShopList);
                jsArr.add(jsonGoodsList);
                jsArr.add(jsonGoodsQuantityList);
                jsArr.add(jsonIsSelectedList);
                jsArr.add(jsonGoodsIndexArr);
                out.print(jsArr);
            } else if (operate.equals("search")) {
                Map<String, List> map = new HashMap<>();
                map.put("shopList", shopList);
                map.put("surplusGoodsList", surplusGoodsList);
                map.put("goodsList", goodsListInCart);
                map.put("goodsQuantityList", goodsQuantityList);
                map.put("isSelectedList", isSelectedList);
                return map;
            }
            return null;
        } else {
            Map<String, List> map = new HashMap<>();
            map.put("shopList", shopList);
            map.put("surplusGoodsList", surplusGoodsList);
            map.put("goodsList", goodsListInCart);
            map.put("goodsQuantityList", goodsQuantityList);
            map.put("isSelectedList", isSelectedList);
            return map;
        }
    }

    /**
     * 处理删除时的数据
     *
     * @param map 传过来信息集合
     * @return Map 处理好的数据
     */
    private Map disposeInfo(String goodsNo, Map map, String... parameter) {
        // 三种情况，插入的商品店铺不存在，则新建店铺，并且新建商品编号、数量。选择状态
        // 插入的商品店铺存在，把店铺移到表尾，新建商品、编号、选择状态
        // 插入的商品存在，则在数量上加1
        // 获取商品的编号和店铺，删除购物车的一项商品
        String goodsQuantity = parameter[0];
        String goodsShop = parameter[1];
        if (map.get("shopList") instanceof List<?> && map.get("surplusGoodsList") instanceof List<?> && map.get("goodsList") instanceof List<?> && map.get("goodsQuantityList") instanceof List<?> && map.get("isSelectedList") instanceof List<?>) {
            @SuppressWarnings("unchecked")
            List<String> shopList = (List<String>) map.get("shopList");
            @SuppressWarnings("unchecked")
            List<String> surplusGoodsList = (List<String>) map.get("surplusGoodsList");
            @SuppressWarnings("unchecked")
            List<String> goodsList = (List<String>) map.get("goodsList");
            @SuppressWarnings("unchecked")
            List<String> goodsQuantityList = (List<String>) map.get("goodsQuantityList");
            @SuppressWarnings("unchecked")
            List<String> isSelectedList = (List<String>) map.get("isSelectedList");
            if (goodsNo != null && goodsQuantity != null && goodsShop != null) {
                // 1.如果商品存在，数量加上选中的数量
                int goodsIndex = goodsList.indexOf(goodsNo);
                if (goodsIndex != -1) {
                    // 剩余商品数不需要加1，此字段代表商品种类，不包括重复的商品
                    int quantity = Integer.parseInt(goodsQuantityList.get(goodsIndex)) + Integer.parseInt(goodsQuantity);
                    goodsQuantityList.set(goodsIndex, String.valueOf(quantity));
                    isSelectedList.set(goodsIndex, "1"); // 选中
                } else {
                    // 2.如果商品店铺不存在存在，就加上商铺
                    int shopIndex = shopList.indexOf(goodsShop);
                    if (shopIndex == -1) {
                        shopList.add(goodsShop);
                        surplusGoodsList.add("1"); // 一个新的商品种类
                    } else {
                        // 对剩余商品数加1
                        int surplus = Integer.parseInt(surplusGoodsList.get(shopIndex)) + 1;
                        surplusGoodsList.set(shopIndex, String.valueOf(surplus));
                        // 3.已经存在，那么移到链表的末尾去，实现移到购物车的顶端
                        String lastShop = shopList.remove(shopIndex);
                        shopList.add(lastShop);
                        String lastSurplus = surplusGoodsList.remove(shopIndex);
                        surplusGoodsList.add(lastSurplus);
                    }
                    goodsList.add(goodsNo);
                    goodsQuantityList.add(goodsQuantity);
                    isSelectedList.add("1"); // 选中
                }
            }
        } else {
            @SuppressWarnings("unchecked")
            List<String> shopList = (List<String>) map.get("shopList");
            @SuppressWarnings("unchecked")
            List<String> surplusGoodsList = (List<String>) map.get("surplusGoodsList");
            @SuppressWarnings("unchecked")
            List<String> goodsList = (List<String>) map.get("goodsList");
            @SuppressWarnings("unchecked")
            List<String> goodsQuantityList = (List<String>) map.get("goodsQuantityList");
            @SuppressWarnings("unchecked")
            List<String> isSelectedList = (List<String>) map.get("isSelectedList");
            shopList.add(goodsShop);
            surplusGoodsList.add("1"); // 一个新的商品种类
            goodsList.add(goodsNo);
            goodsQuantityList.add(goodsQuantity);
            isSelectedList.add("1"); // 选中
        }
        return map;
    }
}


