package com.Lzo.BlackCatShop.bean;

import java.util.Objects;

public class User {
    private String no = null;
    private String username = null;
    private String password = null;
    private String phone_number = null;
    private String nickname = null;
    private int goodsNum = 0;

    public User() {
    }

    public User(String no, String username, String password, String phone_number, String nickname, int goodsNum) {
        this.no = no;
        this.username = username;
        this.password = password;
        this.phone_number = phone_number;
        this.nickname = nickname;
        this.goodsNum = goodsNum;
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public int getGoodsNum() {
        return goodsNum;
    }

    public void setGoodsNum(int goodsNum) {
        this.goodsNum = goodsNum;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return goodsNum == user.goodsNum && Objects.equals(no, user.no) && Objects.equals(username, user.username) && Objects.equals(password, user.password) && Objects.equals(phone_number, user.phone_number) && Objects.equals(nickname, user.nickname);
    }

    @Override
    public int hashCode() {
        return Objects.hash(no, username, password, phone_number, nickname, goodsNum);
    }

    @Override
    public String toString() {
        return "User{" +
                "no='" + no + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", phone_number='" + phone_number + '\'' +
                ", nickname='" + nickname + '\'' +
                ", goodsNum=" + goodsNum +
                '}';
    }
}
