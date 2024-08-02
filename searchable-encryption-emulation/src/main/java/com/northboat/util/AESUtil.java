package com.northboat.util;

import org.apache.commons.codec.binary.Base64;

import java.nio.charset.Charset;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Scanner;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

public class AESUtil {

    static final String TRANSFORMATION = "AES/CBC/PKCS5Padding";    // 指定加密算法
    static final String ALGORITHM = "AES";  // 指定加密规则

    // 生成密钥
    public static SecretKey generateKey() throws NoSuchAlgorithmException {
        KeyGenerator secretGenerator = KeyGenerator.getInstance(ALGORITHM);
        SecureRandom secureRandom = new SecureRandom();
        secretGenerator.init(256, secureRandom);
        SecretKey secretKey = secretGenerator.generateKey();
        return secretKey;
    }

    // 生成CBC模式初始化向量IV
    public static byte[] genIV() throws NoSuchAlgorithmException {
        SecureRandom secureRandom = new SecureRandom();
        byte[] iv = new byte[16];
        secureRandom.nextBytes(iv);
        return iv;
    }

    static Charset charset = Charset.forName("UTF-8");

    // 加密
    public static String encrypt(String content, SecretKey secretKey, byte[] iv) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException { // 加密
        return Base64.encodeBase64String(aes(content.getBytes(charset), Cipher.ENCRYPT_MODE, secretKey, iv));
    }

    // 解密
    public static String decrypt(String contentArray, SecretKey secretKey, byte[] iv) throws InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException { // 解密
        byte[] bytes = Base64.decodeBase64(contentArray);
        byte[] result = aes(bytes, Cipher.DECRYPT_MODE, secretKey, iv);
        return new String(result, charset);
    }

    private static byte[] aes(byte[] contentArray, int mode, SecretKey secretKey, byte[] iv)
            throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION); // 创建加密对象
        IvParameterSpec IVParamSpec = new IvParameterSpec(iv);  // 创建IV向量
        cipher.init(mode, secretKey, IVParamSpec);  // 初始化加解密
        byte[] result = cipher.doFinal(contentArray);   // 进行加解密
        return result;
    }

    public static void main(String[] args) {
        // 输入加密文本
        Scanner s = new Scanner(System.in);
        String content = s.nextLine();

        try {
            SecretKey secretKey = generateKey();
            byte[] iv = genIV();
            String encryptResult = encrypt(content, secretKey, iv);
            System.out.println("encryption:" + encryptResult);
            String decryptResult = decrypt(encryptResult, secretKey, iv);
            System.out.println("decryption:" + decryptResult);
        } catch (NoSuchAlgorithmException | InvalidKeyException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException | InvalidAlgorithmParameterException e) {
            e.printStackTrace();
        }
    }
}