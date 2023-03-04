package com.Lzo.BlackCatShop.bean;

import java.util.Objects;

/**
 * Java类
 */
public class Goods {
    private String goodsNo = null; // 商品编号
    private String goodsShop = null; // 所属商店
    private String goodsPic = null; // 商品图片
    private String goodsName = null; // 商品名称
    private String goodsDetails = null; // 商品详细信息
    private float goodsUnitPrice = 0; // 商品单价

    public Goods() {
    }

    public Goods(String goodsNo, String goodsShop, String goodsPic, String goodsName, String goodsDetails, float goodsUnitPrice) {
        this.goodsNo = goodsNo;
        this.goodsShop = goodsShop;
        this.goodsPic = goodsPic;
        this.goodsName = goodsName;
        this.goodsDetails = goodsDetails;
        this.goodsUnitPrice = goodsUnitPrice;
    }

    public String getGoodsNo() {
        return goodsNo;
    }

    public void setGoodsNo(String goodsNo) {
        this.goodsNo = goodsNo;
    }

    public String getGoodsShop() {
        return goodsShop;
    }

    public void setGoodsShop(String goodsShop) {
        this.goodsShop = goodsShop;
    }

    public String getGoodsPic() {
        return goodsPic;
    }

    public void setGoodsPic(String goodsPic) {
        this.goodsPic = goodsPic;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getGoodsDetails() {
        return goodsDetails;
    }

    public void setGoodsDetails(String goodsDetails) {
        this.goodsDetails = goodsDetails;
    }

    public float getGoodsUnitPrice() {
        return goodsUnitPrice;
    }

    public void setGoodsUnitPrice(float goodsUnitPrice) {
        this.goodsUnitPrice = goodsUnitPrice;
    }


    @Override
    public String toString() {
        return "Goods{" +
                "goodsNo='" + goodsNo + '\'' +
                ", shop='" + goodsShop + '\'' +
                ", goodsPic='" + goodsPic + '\'' +
                ", goodsName='" + goodsName + '\'' +
                ", goodsDetails='" + goodsDetails + '\'' +
                ", goodsUnitPrice=" + goodsUnitPrice +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Goods goods = (Goods) o;
        return Float.compare(goods.goodsUnitPrice, goodsUnitPrice) == 0 && Objects.equals(goodsNo, goods.goodsNo) && Objects.equals(goodsShop, goods.goodsShop) && Objects.equals(goodsPic, goods.goodsPic) && Objects.equals(goodsName, goods.goodsName) && Objects.equals(goodsDetails, goods.goodsDetails);
    }

    @Override
    public int hashCode() {
        return Objects.hash(goodsNo, goodsShop, goodsPic, goodsName, goodsDetails, goodsUnitPrice);
    }
}
