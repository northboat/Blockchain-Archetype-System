package com.northboat.util;

import java.util.Scanner;

public class VFEPlusUtil {

    // 编码函数
    public static String encode(int number) {
        // 将整数转换为二进制字符串
        String binaryString = Integer.toBinaryString(number);
        // 补全前导0到三的倍数长度
        while (binaryString.length() % 3 != 0) {
            binaryString = "0" + binaryString;
        }
//        System.out.println(binaryString);

        // 三位一组分组并转换为八进制
        StringBuilder octalString = new StringBuilder();
        for (int i = 0; i < binaryString.length(); i += 3) {
            String binaryGroup = binaryString.substring(i, i + 3);
            int octalValue = Integer.parseInt(binaryGroup, 2);
            octalString.append(Integer.toOctalString(octalValue));
        }

        while (octalString.length() % 3 != 0) {
            octalString.insert(0,"0");
        }
//        System.out.println(octalString);

        // 反转八进制字符串
        return octalString.reverse().toString();
    }

    // 解码函数
    public static int decode(String vfe) {
        // 反转字符串
        String reversedVFE = new StringBuilder(vfe).reverse().toString();

        // 将每个字符转成八进制数，再转成二进制
        StringBuilder binaryString = new StringBuilder();
        for (int i = 0; i < reversedVFE.length(); i++) {
            int octalValue = Character.getNumericValue(reversedVFE.charAt(i));
            String binaryGroup = Integer.toBinaryString(octalValue);
            // 补全前导0到三位
            while (binaryGroup.length() < 3) {
                binaryGroup = "0" + binaryGroup;
            }
            binaryString.append(binaryGroup);
        }

        // 转换为十进制数
        return Integer.parseInt(binaryString.toString(), 2);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("十进制数：");
        int number = scanner.nextInt();

        String encoded = encode(number);
        int decoded = decode(encoded);

        System.out.println("Original: " + number);
        System.out.println("Encoded: " + encoded);
        System.out.println("Decoded: " + decoded);
    }
}
