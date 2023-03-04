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
import java.util.*;

// 模板类
@WebServlet({"/shoppingCart/page", "/shoppingCart/recordGoodsInformation", "/shoppingCart/settleAccount", "/shoppingCart/delete", "/shoppingCart/getAllGoods"})
public class ShoppingCartServlet extends HttpServlet {
    // 模板方法设计模式",
    // 重写service方法
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
            // 跳转到购物车
            String servletPath = req.getServletPath();
            if ("/shoppingCart/page".equals(servletPath)) {
                resp.sendRedirect("/BlackCatShop/shopping/shoppingCart.html?loginStatus=success");
            } else if ("/shoppingCart/getAllGoods".equals(servletPath)) {
                getAllGoods(req, resp, username, "refresh");
            } else if ("/shoppingCart/settleAccount".equals(servletPath)) {
                settleAccount(req, resp);
            } else if ("/shoppingCart/recordGoodsInformation".equals(servletPath)) {
                // 得到hashmap
                Map<String, List> map = getAllGoods(req, resp, username, "search");
                recordGoodsInformation(req, resp, username, map);
            } else if ("/shoppingCart/delete".equals(servletPath)) {
                // 得到hashmap
                Map<String, List> map = getAllGoods(req, resp, username, "search");
                doDel(req, resp, username, map);
            }
        } else {
            // 跳转到登录页面
            resp.sendRedirect(req.getContextPath() + "/shopping/login.html");
        }
    }

    private synchronized void recordGoodsInformation(HttpServletRequest req, HttpServletResponse resp, String username, Map map) throws ServletException, IOException {
        // 解决请求体的中文乱码问题
        resp.setContentType("text/html;charset=UTF-8");
        req.setCharacterEncoding("UTF-8");
        // 获取表单的数据
        String goodsNo = req.getParameter("goodsNo");
        String goodsQuantity = req.getParameter("goodsQuantity");
        String isSelected = req.getParameter("isSelected");
        Map afterChangeMap = disposeInfo(goodsNo, map, null, goodsQuantity, isSelected);
        // 根据编号获得
        int count = new CartDao().doUpdate(username, afterChangeMap);
        if (count == 1) {
            // 删除成功，仍然回到购物车界面，当然要刷新数据到界面上啦
            System.out.println("修改的商品编号是:   " + goodsNo);
            System.out.println();
        } else {
            // 到另一个界面，提示删除失败
            resp.sendRedirect(req.getContextPath() + "/shopping/error.html");
        }
    }

    private synchronized void settleAccount(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 设置响应的类型和字符集
        resp.setContentType("text/html;charset=UTF-8");
        String goodsNo = req.getParameter("goodsNo");
        String goodsQuantityString = req.getParameter("goodsQuantity");
        // 返回对象
        Goods oneGoods = new CartDao().doOneSearch(goodsNo, goodsQuantityString);
        // 没做
    }

    private synchronized void doDel(HttpServletRequest req, HttpServletResponse resp, String username, Map map) throws ServletException, IOException {
        // 获取商品的编号和店铺，删除购物车的一项商品
        String goodsNo = req.getParameter("goodsNo");
        String shopName = req.getParameter("shopName");
        Map<String, List> afterChangeMap = disposeInfo(goodsNo, map, shopName, null, null);
        // 根据编号获得
        int count = new CartDao().doUpdate(username, afterChangeMap);
        if (count == 1) {
            UserDao userDao = new UserDao();
            String num = userDao.getGoodsNum(username);
            String nowNum = String.valueOf(Integer.parseInt(num) - 1);
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
    private synchronized Map<String, List> getAllGoods(HttpServletRequest req, HttpServletResponse resp, String username, String operate) throws ServletException, IOException {
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
        int[] goodsIndexArr = new int[cart.getGoodsList().size()];
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
    }

    /**
     * 处理删除或修改的数据
     *
     * @param map 传过来信息集合
     * @return Map 处理好的数据
     */
    private Map<String, List> disposeInfo(String goodsNo, Map<String, List> map, String... parameter) {
        // 根据商店找到剩余商品数量，-1后看是否为零，如果为0就把商店和剩余商品数的字段删除
        // 得到商品的编号，在商品字段，数量字段，选中字段删除
        String shopName = parameter[0];
        String goodsQuantity = parameter[1];
        String isSelected = parameter[2];
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
            if (shopName != null) {
                // 得到下标，删除操作
                int shopIndex = shopList.indexOf(shopName);
                if (shopIndex != -1) {
                    int surplusNum = Integer.parseInt(surplusGoodsList.get(shopIndex)) - 1;
                    // 去除店铺和店铺剩余数量
                    if (surplusNum == 0) {
                        shopList.remove(shopIndex);
                        surplusGoodsList.remove(shopIndex);
                    } else {
                        surplusGoodsList.set(shopIndex, String.valueOf(surplusNum));
                    }
                    // 当删除完了后，设其内容填充为"#"
                    if(shopList.size() == 0){
                        shopList.add("#");
                    }
                    if(surplusGoodsList.size() == 0){
                        surplusGoodsList.add("#");
                    }
                }
                // 得到下标
                int goodsIndex = goodsList.indexOf(goodsNo);
                if (goodsIndex != -1) {
                    // 删除元素
                    goodsList.remove(goodsIndex);
                    goodsQuantityList.remove(goodsIndex);
                    isSelectedList.remove(goodsIndex);
                }
                // 当删除完了后，设其内容填充为"#"
                if(goodsList.size() == 0){
                    goodsList.add("#");
                }
                if(goodsQuantityList.size() == 0){
                    goodsQuantityList.add("#");
                }
                if(isSelectedList.size() == 0){
                    isSelectedList.add("#");
                }
            } else if (goodsQuantity != null && isSelected != null) {
                // 找到goods，找它对应的下标的数量和选中状态操作
                // 修改操作
                int goodsIndex = goodsList.indexOf(goodsNo);
                if(isSelected.equals("true")){
                    isSelected = "1";
                } else {
                    // 不是true就是没选中
                    isSelected = "0";
                }
                if (goodsIndex != -1) {
                    // 修改元素
                    goodsQuantityList.set(goodsIndex, goodsQuantity);
                    isSelectedList.set(goodsIndex, isSelected);
                }
            }
        }
        return map;
    }
}
