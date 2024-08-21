package com.northboat.util;

import java.nio.ByteBuffer;

public class ByteUtil {
    // 连接三个比特数组
    public static byte[] joinByteArray(byte[] byte1, byte[] byte2, byte[] byte3) {
        return ByteBuffer.allocate(byte1.length + byte2.length + byte3.length)
                .put(byte1)
                .put(byte2)
                .put(byte3)
                .array();
    }

    public static byte[] joinByteArray(byte[] byte1, byte[] byte2) {
        return ByteBuffer.allocate(byte1.length + byte2.length)
                .put(byte1)
                .put(byte2)
                .array();
    }


    public static void printBytes(byte[] bytes){
        for(byte b: bytes){
            System.out.print(b);
        }
        System.out.println();
    }
}
