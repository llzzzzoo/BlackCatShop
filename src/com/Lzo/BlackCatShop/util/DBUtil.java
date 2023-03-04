package com.Lzo.BlackCatShop.util;

import java.sql.*;
import java.util.LinkedList;
import java.util.ResourceBundle;

/**
 * JDBC的工具类
 */
public class DBUtil {
    // 静态变量，类加载时执行
    // 具有从上往下的顺序，实现属性资源文件绑定
    private static final ResourceBundle bundle = ResourceBundle.getBundle("resources.jdbc");
    private static final String url = bundle.getString("url");
    private static final String  user = bundle.getString("user");
    private static final String password = bundle.getString("password");
    private static final String driver = bundle.getString("driver");
    private static final LinkedList<Connection> DBCP = new LinkedList<>(); // 双向链表，数据库连接池原型

    static {
        // 注册驱动，只需要注册一次，放在静态代码块，在DBUtil类加载的时候执行
        // 注册驱动
        try {
            // 使用properties为了符合OCP原则
            Class.forName(driver);
            Connection con;
            int max = 20;
            //用一个for循环来创建二十个连接
            for (int i = 0; i <= max; i++) {
                con = DriverManager.getConnection(url, user, password);
                DBCP.add(con);//并且同时把连接放到链表里面
            }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取数据库连接对象
     * @return conn 连接对象
     * @throws SQLException 抛出异常
     */
    public static synchronized Connection getConnection() throws SQLException {
        // 获取连接
        // 返回第一个元素的同时去除它
        return DBCP.removeFirst();
    }

    /**
     * 此处实现把连接释放,把连接加到链表去
     * @param conn 释放连接时传过来的参数
     */
    public static synchronized void releaseConnection(Connection conn){
        DBCP.add(conn);//默认加到最后去
    }

    public static synchronized void close(Statement ps, ResultSet rs){
        if(rs != null){
            try {
                rs.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(ps != null){
            try {
                ps.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

    public static synchronized String getMaxNo(String tableName){
        Connection conn;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = getConnection();
            String sql = "select * from t_user where no in (select MAX(no) from "+ tableName +")";
            ps = conn.prepareStatement(sql);
            //ps.setString(1, tableName);
            rs = ps.executeQuery();
            if(rs.next()){
                String no;
                no = rs.getString("no");
                return no;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            close(ps, rs);
        }
        return "0"; // 没有用户时，编号0即为初始
    }

}
