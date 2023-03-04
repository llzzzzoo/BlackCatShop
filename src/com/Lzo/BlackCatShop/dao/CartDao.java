package com.Lzo.BlackCatShop.dao;

import com.Lzo.BlackCatShop.bean.Cart;
import com.Lzo.BlackCatShop.bean.Goods;
import com.Lzo.BlackCatShop.util.DBUtil;
import com.Lzo.BlackCatShop.util.StrUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class CartDao {

    public Goods doOneSearch(String goodsNo, String goodsQuantityString){
        // 创建对象
        Goods oneGoods = new Goods();
        // 连接数据库，查询购物车的所有信息
        Connection conn;
        PreparedStatement ps = null;
        ResultSet rs = null;
        boolean flag = false;
        try {
            // 获取连接
            conn = DBUtil.getConnection();
            // 获取预编译的数据库操作对象
            String sql = "select * from t_commodity where no = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, goodsNo);
            rs = ps.executeQuery();
            if (rs.next()){
                flag = true;
                String no = rs.getString("no");
                String shop = rs.getString("shop");
                String goodsPic = rs.getString("goods_pic");
                String name = rs.getString("name");
                String goodsDetails = rs.getString("details");
                float goodsUnitPrice = rs.getFloat("unit_price");
                oneGoods.setGoodsNo(no);
                oneGoods.setGoodsShop(shop);
                oneGoods.setGoodsPic(goodsPic);
                oneGoods.setGoodsName(name);
                oneGoods.setGoodsDetails(goodsDetails);
                oneGoods.setGoodsUnitPrice(goodsUnitPrice);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
            DBUtil.close(ps ,rs);
        }
        return flag ? oneGoods : null;
    }

    /**
     *  删除操作在该张表中实际是为修改操作
     * @param username 用户名
     * @param map 存放了该表相关字段的数据
     * @return 为1表明操作成功
     */
    public int doUpdate(String username, Map map){
        // 将map集合的数据变成字符串
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
        String shop = StrUtil.mergeString(shopList).toString();
        String surplusGoods = StrUtil.mergeString(surplusGoodsList).toString();
        String goods = StrUtil.mergeString(goodsList).toString();
        String goodsQuantity = StrUtil.mergeString(goodsQuantityList).toString();
        String isSelected = StrUtil.mergeString(isSelectedList).toString();
        List<String> strList = new ArrayList<>(5);
        strList.add(shop);
        strList.add(surplusGoods);
        strList.add(goods);
        strList.add(goodsQuantity);
        strList.add(isSelected);
        for (int i = 0; i < strList.size(); i++) {
            if(strList.get(i) == null){
                strList.set(i, "#");
            }
        }
        // 连接数据库删除数据
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        int count = 0;
        try {
            conn = DBUtil.getConnection();
            // 开启事务（自动提交机制关闭）
            conn.setAutoCommit(false);
            String sql = "update t_cart set shop = ?, surplusGoods = ?, goodsNo = ?, goodsQuantity = ?, isSelected = ? where username = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, shop);
            ps.setString(2, surplusGoods);
            ps.setString(3, goods);
            ps.setString(4, goodsQuantity);
            ps.setString(5, isSelected);
            ps.setString(6, username);
            count  = ps.executeUpdate();
            // 事务提交
            conn.commit();
        } catch (SQLException e) {
            System.out.println("error");
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }
        return count;
    }

    /**
     * 这个方法得到了某个用户购物车的相关信息，包括：店铺、商品、商品数量、选中状态、店铺数、商品数
     * @param username 用户编号
     * @return 返回一个包含了
     */
    public synchronized Cart getCartInfo(String username){
        Cart cart = new Cart();
        // 获取底层的数据
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        boolean flag = false;
        try {
            conn = DBUtil.getConnection();
            String sql = "select * from t_cart where username = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            rs = ps.executeQuery();
            if(rs.next()){
                flag = true;
                // 把字符串拆开，放入双向链表
                List<String> shopList = StrUtil.splitString(rs.getString("shop"));
                List<String> surplusGoodsList = StrUtil.splitString(rs.getString("surplusGoods"));
                List<String> goodsList = StrUtil.splitString(rs.getString("goodsNo"));
                List<String> goodsQuantityList = StrUtil.splitString(rs.getString("goodsQuantity"));
                List<String> isSelectedList = StrUtil.splitString(rs.getString("isSelected"));

                cart.setCartNo(rs.getString("no"));
                cart.setUsername(rs.getString("username"));
                cart.setShopList(shopList);
                cart.setSurplusGoodsList(surplusGoodsList);
                cart.setGoodsList(goodsList);
                cart.setGoodsQuantity(goodsQuantityList);
                cart.setIsSelected(isSelectedList);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }
        return flag ? cart : null;
    }
}
