package com.canoe.javawebsocketserver.util;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class CallUtil {

    public static String call(String message){
        try{
            System.out.println("收到前端请求，尝试运行本地C程序");
            // ipconfig
            // dir
            // E:\File\XDU\Java-WebSocket-Server\src\main\resources\c-lib\test
            Process pro = Runtime.getRuntime().exec(message);
            InputStream in = pro.getInputStream();

            ByteArrayOutputStream bos = new ByteArrayOutputStream();

            //读取缓存
            byte[] buffer = new byte[2084];
            int length = 0;
            while((length = in.read(buffer)) != -1) {
                bos.write(buffer, 0, length);//写入输出流
            }
            in.close();//读取完毕，关闭输入流

            System.out.println("运行成功，结果为: " + bos.toString() + "\n即将反馈前端信息");

            //获取ipv4地址字符串并返回
            return bos.toString();
        }catch (Exception e){
            e.printStackTrace();
            return "something wrong happened";
        }
    }

}
