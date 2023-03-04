package com.Lzo.BlackCatShop.dao;

import com.Lzo.BlackCatShop.bean.User;
import com.Lzo.BlackCatShop.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDao {

    public User userLogin(String username, String password){
        // 连接数据库验证密码咯
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        User user = null;
        String no;
        String phoneNumber;
        String nickname;
        int goodsNum;
        try {
            conn = DBUtil.getConnection();
            String sql = "select * from t_user where username = ? and password = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, password);
            rs = ps.executeQuery();
            if(rs.next()){
                no = rs.getString("no");
                username = rs.getString("username");
                password = rs.getString("password");
                phoneNumber = rs.getString("phone_number");
                nickname = rs.getString("nickname");
                goodsNum = rs.getInt("goodsNum");
                user = new User(no, username, password, phoneNumber, nickname, goodsNum);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }
        return user;
    }

    public void userRegister(int no, String username, String password, String phoneNum, String nickname){
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = DBUtil.getConnection();
            conn.setAutoCommit(false);
            String sql = "insert into t_user values(?, ?, ?, ?, ?, ?)";
            ps = conn.prepareStatement(sql);
            ps.setString(1, String.valueOf(no));
            ps.setString(2, username);
            ps.setString(3, password);
            ps.setString(4, phoneNum);
            ps.setString(5, nickname);
            ps.setInt(6, 0);
            int count = ps.executeUpdate();
            if(count == 1){
                conn.commit();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, null);
        }
    }


    public void createCart(int no, String username){
        Connection conn = null;
        PreparedStatement ps = null;
        try {
            conn = DBUtil.getConnection();
            conn.setAutoCommit(false);
            String sql = "insert into t_cart values(?, ?, ?, ?, ?, ?, ?)";
            ps = conn.prepareStatement(sql);
            ps.setString(1, String.valueOf(no));
            ps.setString(2, username);
            ps.setString(3, "#");
            ps.setString(4, "#");
            ps.setString(5, "#");
            ps.setString(6, "#");
            ps.setString(7, "#");
            int count = ps.executeUpdate();
            if(count == 1){
                conn.commit();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, null);
        }
    }

    public boolean doSearch(String username, String password){
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            String sql = "select * from t_user where username = ? and password  =?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, password);
            rs = ps.executeQuery();
            if(rs.next()){
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }
        return false;
    }

    public String getGoodsNum(String username){
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            String sql = "select * from t_user where username = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            rs = ps.executeQuery();
            if(rs.next()){
                return rs.getString("goodsNum");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, rs);
        }
        return null;
    }

    public boolean updateInfo(String username, String... parameter){
        Connection conn = null;
        PreparedStatement ps = null;
        String goodsNum = null;
        if(parameter[0].equals("updateNum")){
            goodsNum = parameter[1];
        }
        try {
            conn = DBUtil.getConnection();
            String sql = "update t_user set goodsNum = ? where username = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, goodsNum);
            ps.setString(2, username);
            int count = ps.executeUpdate();
            if(count == 1){
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.releaseConnection(conn);
            DBUtil.close(ps, null);
        }
        return false;
    }

}
