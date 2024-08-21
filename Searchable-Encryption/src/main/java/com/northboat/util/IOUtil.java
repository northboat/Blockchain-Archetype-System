package com.northboat.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class IOUtil {
    public static String readDocs(String path) {
        // 如何相对路径读取捏
        File file = new File("E:\\File\\XDU\\项目\\可搜索加密算法仿真\\se-emulation\\src\\main\\resources\\"+path);
        String docs = null;
        try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
            // 接收文件内容 stringBuffer线程安全
            StringBuilder stringBuilder = new StringBuilder();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
            }
            docs = stringBuilder.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 关闭流
        return docs;
    }


}
