package com.Lzo.BlackCatShop.dao;

import com.Lzo.BlackCatShop.bean.Goods;
import com.Lzo.BlackCatShop.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class GoodsDao {
    public List<Goods> getAllGoods(){
        List<Goods> goods = new ArrayList<>();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            // 获取连接
            conn = DBUtil.getConnection();
            String sql = "select * from t_commodity";
            ps =  conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while(rs.next()){
                Goods row = new Goods();
                row.setGoodsNo(rs.getString("no"));
                row.setGoodsShop(rs.getString("shop"));
                row.setGoodsPic(rs.getString("goods_pic"));
                row.setGoodsName(rs.getString("name"));
                row.setGoodsDetails(rs.getString("details"));
                row.setGoodsUnitPrice(rs.getInt("unit_price"));
            }
        } catch(Exception e){
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }

        return goods;
    }

    /**
     * 获取某个用户放在购物车的单件商品的信息
     * @return goods类
     */
    public Goods getCartGoods(String goodsNo){
        // 集合存储数据
        List<Goods> allGoods = new ArrayList<>();
        // 连接数据库，查询购物车的所有信息
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        boolean flag = false;
        Goods oneGoods = new Goods();
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
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }
        return flag ? oneGoods : null;
    }
}
