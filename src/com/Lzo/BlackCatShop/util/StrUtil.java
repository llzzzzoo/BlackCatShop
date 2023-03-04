package com.Lzo.BlackCatShop.util;

import java.util.Collection;
import java.util.LinkedList;

public class StrUtil {
    /**
     * 将指定字符串以&分割并存入双向链表中
     * @param str 指定字符串
     * @return 得到的字符串的双向链表
     */
    public static synchronized LinkedList<String> splitString(String str){
        LinkedList<String> list = new LinkedList<>();
        // 先查看有没有&分隔符，没的话直接结束
        if(!str.contains("&")) return list;
        // 以&分割字符串，从左至右依次存入双向链表中
        // 末尾的&符号会自动忽略
        String[] strSplit = str.split("&");
        for(int i = 0; i < strSplit.length; i++){
            list.add(strSplit[i]);
        }
        return list;
    }

    /**
     * 将指定集合的内容以&连接成字符串
     * @param link 指定集合
     * @return 得到的连接号的字符串
     */
    public static synchronized StringBuffer mergeString(Collection<String> link){
        if(link == null)return null;
        StringBuffer strBf = new StringBuffer();
        boolean flag = false;
        // 迭代拼接字符串
        for (String s : link) {
            flag = true;
            if (!s.equals("#")) {
                strBf.append(s).append("&");
            }else{
                strBf.append(s);
            }
        }
        return flag? strBf : null;
    }
}
