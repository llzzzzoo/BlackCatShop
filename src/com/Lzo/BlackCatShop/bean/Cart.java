package com.Lzo.BlackCatShop.bean;

import java.util.List;
import java.util.Objects;

public class Cart{
    private String cartNo; // 编号
    private String username; // 对应user的编号
    private List<String> shopList; // 商店的集合
    private List<String> surplusGoodsList; // 商店的集合
    private List<String> goodsList; // 商品的集合
    private List<String> goodsQuantity; // 商品数目的集合
    private List<String> isSelected; // 是否选中的集合


    public Cart() {
    }

    public Cart(String cartNo, String username, List<String> shopList, List<String> surplusGoodsList, List<String> goodsList, List<String> goodsQuantity, List<String> isSelected) {
        this.cartNo = cartNo;
        this.username = username;
        this.shopList = shopList;
        this.surplusGoodsList = surplusGoodsList;
        this.goodsList = goodsList;
        this.goodsQuantity = goodsQuantity;
        this.isSelected = isSelected;
    }

    public String getCartNo() {
        return cartNo;
    }

    public void setCartNo(String cartNo) {
        this.cartNo = cartNo;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getShopList() {
        return shopList;
    }

    public void setShopList(List<String> shopList) {
        this.shopList = shopList;
    }

    public List<String> getSurplusGoodsList() {
        return surplusGoodsList;
    }

    public void setSurplusGoodsList(List<String> surplusGoodsList) {
        this.surplusGoodsList = surplusGoodsList;
    }

    public List<String> getGoodsList() {
        return goodsList;
    }

    public void setGoodsList(List<String> goodsList) {
        this.goodsList = goodsList;
    }

    public List<String> getGoodsQuantity() {
        return goodsQuantity;
    }

    public void setGoodsQuantity(List<String> goodsQuantity) {
        this.goodsQuantity = goodsQuantity;
    }

    public List<String> getIsSelected() {
        return isSelected;
    }

    public void setIsSelected(List<String> isSelected) {
        this.isSelected = isSelected;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Cart cart = (Cart) o;
        return Objects.equals(cartNo, cart.cartNo) && Objects.equals(username, cart.username) && Objects.equals(shopList, cart.shopList) && Objects.equals(surplusGoodsList, cart.surplusGoodsList) && Objects.equals(goodsList, cart.goodsList) && Objects.equals(goodsQuantity, cart.goodsQuantity) && Objects.equals(isSelected, cart.isSelected);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cartNo, username, shopList, surplusGoodsList, goodsList, goodsQuantity, isSelected);
    }

    @Override
    public String toString() {
        return "Cart{" +
                "cartNo='" + cartNo + '\'' +
                ", username='" + username + '\'' +
                ", shopList=" + shopList +
                ", surplusGoodsList=" + surplusGoodsList +
                ", goodsList=" + goodsList +
                ", goodsQuantity=" + goodsQuantity +
                ", isSelected=" + isSelected +
                '}';
    }
}
