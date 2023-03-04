package com.Lzo.BlackCatShop.servlet;

import com.Lzo.BlackCatShop.dao.UserDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet({"/homepage", "/user/exit"})
public class HomepageServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String servletPath = req.getServletPath();
        Cookie[] cookies = req.getCookies(); // 获取cookie
        String username = null;
        String password = null;
        UserDao userDao = new UserDao();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if ("username".equals(name)) {
                    username = cookie.getValue();
                } else if ("password".equals(name)) {
                    password = cookie.getValue();
                }
            }
        }
        if ("/homepage".equals(servletPath)) {
            // 验证是否存有cookie的，如果存了就直接登录，没存的话就登录普通的页面
            // 为什么要同时验证账号密码呢？因为密码万一改了，就不能用cookie了
            boolean result;
            if (username != null && password != null) {
                result = userDao.doSearch(username, password);
                if (result) {
                    resp.sendRedirect(req.getContextPath() + "/index.html?loginStatus=success");
                } else {
                    resp.sendRedirect(req.getContextPath() + "/index.html");
                }
            } else {
                // 要手动设置index路径了
                resp.sendRedirect(req.getContextPath() + "/index.html");
            }
        } else if ("/user/exit".equals(servletPath)) {
            doExit(req, resp, cookies);
        }
    }

    protected void doExit(HttpServletRequest req, HttpServletResponse resp, Cookie[] cookies) throws ServletException, IOException {
        // 获取session对象，销毁session
        HttpSession session = req.getSession(false);
        if (session != null) {
            // 手动销毁session对象
            session.invalidate();
        } else if(cookies != null){
            // 把cookie设置为空
            for (Cookie cookie : cookies) {
                // 删除cookie的话需要重新设置一次信息，因为一个名字不能让浏览器确定是哪个cookie，所以需要更具体的信息
                // 所以要把要删除的cookie的信息与初始状态对应
                cookie.setMaxAge(0);
                cookie.setPath(req.getContextPath());
                // 设置了之后也要提交啊
                resp.addCookie(cookie);
            }
        }
        // 要手动设置index路径了
        resp.sendRedirect(req.getContextPath() + "/index.html");
    }
}
