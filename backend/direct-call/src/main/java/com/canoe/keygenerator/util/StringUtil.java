package com.canoe.keygenerator.util;

import java.util.HashMap;
import java.util.Map;

public class StringUtil {
    public static Map<String, String> parseStrToJson(String str) throws Exception{
        Map<String, String> json = new HashMap<>();
        String[] list = str.split("\n");
        for(String s: list){
            String[] l = s.split(":");
            System.out.println(l[0] + ":" + l[1]);
            json.put(l[0], l[1]);
        }
        return json;
    }
}
