package com.Lzo.BlackCatShop.servlet;

import com.Lzo.BlackCatShop.bean.User;
import com.Lzo.BlackCatShop.dao.UserDao;
import com.Lzo.BlackCatShop.util.DBUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 关于返回到浏览器注册界面的状态码
 * 100: 前后密码不一致
 * 101: 密码长度不对
 * 102: 密码符号错误
 * 200: 手机号格式错误
 * 201: 手机号注册过
 * 300: 昵称长度不对
 * 301: 昵称符号不对
 * 302: 昵称注册过
 */
@WebServlet({"/user/login", "/user/register"})
public class UserServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String servletPath = req.getServletPath();
        if ("/user/login".equals(servletPath)) {
            doLogin(req, resp);
        } else if ("/user/register".equals(servletPath)) {
            doRegister(req, resp);
        }
    }


    protected void doLogin(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 验证码手机号和密码是否正确
        // 获取手机号和密码
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        UserDao userDao = new UserDao();
        User user = userDao.userLogin(username, password);

        if (user != null){
            // 设置cookie
            String directlySignIn = req.getParameter("directlySignIn");
            // 创建cookie对象存储用户名
            Cookie userNo = new Cookie("userNo", user.getNo());
            Cookie userName = new Cookie("username", user.getUsername());
            Cookie userPassword = new Cookie("password", user.getPassword());
            Cookie userNickname = new Cookie("nickname", user.getNickname());
            Cookie userGoodsNum = new Cookie("goodsNum", String.valueOf(user.getGoodsNum()));
            Cookie loginStatus = new Cookie("loginStatus", "true");
            // 根据用户的UID(no)找到商店的名字，存入数组，以&做间隔

            // 根据用户的UID(no)找到商品的名字，存入数组，以&做间隔
            Cookie[] cookies = {userNo, userName, userPassword, userNickname, userGoodsNum, loginStatus};

            if("1".equals(directlySignIn)){
                // 设置cookie的有效期为七天
                for(Cookie cookie : cookies){
                    cookie.setMaxAge(60 * 60 * 24 * 7);
                }
            } else{
                // 如果不选择免登录，那么设置cookie的有效期为一天
                for(Cookie cookie : cookies){
                    cookie.setMaxAge(60 * 60 * 24);
                }
            }
            // 设置cookie的path，直接设置根路径，只要访问浏览器就会携带这个cookie
            for(Cookie cookie : cookies){
                cookie.setPath(req.getContextPath());
            }
            // 响应cookie给浏览器
            for(Cookie cookie : cookies){
                resp.addCookie(cookie);
            }
            // 成功跳到index界面
            resp.sendRedirect(req.getContextPath() + "/homepage");
        } else{
            // 跳转失败界面，并会提示登录操作失败
            resp.sendRedirect(req.getContextPath() + "/shopping/login.html?" + "loginStatus=fail");
        }
    }

    protected void doRegister(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
        String phoneNum = req.getParameter("telephoneNum");
        String nickname = req.getParameter("nickname");
        String password = req.getParameter("password");
        String username = phoneNum; // 用户名就是手机号
        String maxUserNo = DBUtil.getMaxNo("t_user");
        String pswAgain = req.getParameter("passwordAgain");
        String registerProblem;
        String maxCartNo = DBUtil.getMaxNo("t_cart");
        int userNo = Integer.parseInt(maxUserNo) + 1;
        int cartNo = Integer.parseInt(maxCartNo) + 1;

        registerProblem = checkPassword(password, pswAgain);
        if(!registerProblem.equals("null")){
            // 如果进入if说明出现了问题
            resp.sendRedirect(req.getContextPath() + "/shopping/register.html?registerProblem=" + registerProblem);
            return;
        }
        registerProblem = checkPhoneNum(phoneNum);
        if(!registerProblem.equals("null")){
            // 如果进入if说明出现了问题
            resp.sendRedirect(req.getContextPath() + "/shopping/register.html?registerProblem=" + registerProblem);
            return;
        }
        registerProblem = checkNickname(nickname);
        if(!registerProblem.equals("null")){
            // 如果进入if说明出现了问题
            resp.sendRedirect(req.getContextPath() + "/shopping/register.html?registerProblem=" + registerProblem);
            return;
        }
        UserDao userDao = new UserDao();
        userDao.userRegister(userNo, username, password, phoneNum, nickname);
        userDao.createCart(cartNo, username);
        resp.sendRedirect(req.getContextPath() + "/shopping/login.html");
    }

    /**
     * 验证前后密码是否一致，检查长度、字母
     * @param password 密码
     * @param pswAgain 再次输入的密码
     * @return 返回为null表明没问题
     */
    protected String checkPassword(String password, String pswAgain){
        // 前后密码不一致
        if(!password.equals(pswAgain)){
            return "100";
        }
        // 密码长度不对
        if(password.length() < 6 || password.length() > 14){
            return "101";
        }
        // 符号错误，遍历一遍密码，只要密码是指定范围的字符串就行了
        if(!password.matches("^[0-9a-zA-Z!@#$%^&*_+=]*$")){
            return "102";
        }

        return "null";
    }

    /**
     * 验证手机号格式是否正确，手机号是否注册过
     * @param phoneNum 电话号码
     * @return 返回为null表明没问题
     */
    protected String checkPhoneNum(String phoneNum){
        if(!phoneNum.matches("^[1][345789][0-9]{9}$")){
            return "200";
        }
        if(doCheck("phone_number", phoneNum)){
            return "201";
        }
        return "null";
    }

    /**
     * 查昵称是否注册过，检查是否是字母和数字，检查长度
     * @param nickname 用户名
     * @return 返回为null表明为没问题
     */
    protected String checkNickname(String nickname){
        if(nickname.length() < 6 || nickname.length() > 14){
            return "300";
        }
        if(!nickname.matches("^[0-9a-zA-Z!@#$%^&*_+=]*$")){
            return "301";
        }
        if(doCheck("nickname", nickname)){
            return "302";
        }
        return "null";
    }

    /**
     * 查询在user表某个值是否存在于某个字段
     * @param field 字段
     * @param elem 元素值
     * @return 查询到为true，否则为false
     */
    protected boolean doCheck(String field, String elem){
        Connection conn;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DBUtil.getConnection();
            String sql = "select * from t_user where " + field + " = ?";
            ps = conn.prepareStatement(sql);
            ps.setString(1, elem);
            rs = ps.executeQuery();
            if(rs.next()){
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBUtil.close(ps, rs);
        }
        return false;
    }
}