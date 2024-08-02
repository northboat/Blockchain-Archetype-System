package com.northboat;

import com.northboat.pojo.KeyPair;
import com.northboat.util.*;
import it.unisa.dia.gas.jpbc.Element;
import it.unisa.dia.gas.jpbc.Field;
import it.unisa.dia.gas.jpbc.Pairing;
import it.unisa.dia.gas.plaf.jpbc.pairing.PairingFactory;
import org.springframework.util.DigestUtils;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

public class Main {

    // 系统初始化

    // 循环群 G1,GT, 整数群 Zr
    private static final Field G1, GT, Zr;
    // 两个生成元
    private static final Element g, h;
    private static final Pairing bp;
    // 全局变量初始化
    static{
        bp = PairingFactory.getPairing("a.properties");
        G1 = bp.getG1();
        GT = bp.getGT();
        Zr = bp.getZr();
        g = G1.newRandomElement().getImmutable();
        h = G1.newRandomElement().getImmutable();
    }

    // 密钥生成中心密钥对kgc, 搜索服务器密钥对svr, 数据所有者密钥对co, 数据用户密钥对tu
    private static KeyPair kgc, svr, co, tu;
    // 密钥对初始化
    public static void systemKeyInit(){
        Element x = Zr.newRandomElement().getImmutable();
        Element t = Zr.newRandomElement().getImmutable();
        Element s = Zr.newRandomElement().getImmutable();
        Element r = Zr.newRandomElement().getImmutable();


        kgc = new KeyPair(x, g.powZn(x).getImmutable());
        svr = new KeyPair(t, g.powZn(t).getImmutable());
        co = new KeyPair(s, g.powZn(s).getImmutable());
        tu = new KeyPair(r, g.powZn(r).getImmutable());
    }

    public static void systemInit(){
        // 1、系统参数初始化
        System.out.println("系统参数初始化\n=======================");
        systemKeyInit();
        System.out.println("kgc: " + kgc);
        System.out.println("svr: " + svr);
        System.out.println("co: " + co);
        System.out.println("tu: " + tu);
        System.out.println("=======================\n");
    }






    // 身份认证

    // 将比特数组 md5 哈希加密并映射到循环群 G1 上
    public static Element hashG(byte[] bytes){
        Element hash = null;
        try{
            byte[] md5 = DigestUtils.md5Digest(bytes);
            // 注意，对于Type A1来说，这个代码无法指定哈希到指定子群Gpi中。解决方法是将byte[]先哈希到Z群
            // 然后利用G,GT的生成元计算幂指数，从而达到哈希到G,GT上的效果
            Element x = Zr.newElement().setFromHash(md5, 0, md5.length);
            hash = g.powZn(x).getImmutable();
        }catch (Exception e){
            e.printStackTrace();
        }
        return hash;
    }

    // 将比特数组 MD5 加密后映射到 Zr 群上
    public static Element hashZ(byte[] bytes){
        Element hash = null;
        try{
            byte[] md5 = DigestUtils.md5Digest(bytes);
            hash = Zr.newElement().setFromHash(md5, 0, md5.length);
        }catch (Exception e){
            e.printStackTrace();
        }
        return hash;
    }

    // 数据私有者和数据用户的 ID
    private static Element id_o, id_u, k;
    // 用于身份验证（数据私有者和数据用户之间）的两个密钥对
    private static KeyPair ao, au;
    public static void authKeyInit(){
        id_o = Zr.newRandomElement().getImmutable();
        id_u = Zr.newRandomElement().getImmutable();

        Element x = Zr.newRandomElement();
//        System.out.println(hash(id_o.toBytes()));

        ao = new KeyPair(hashG(id_o.toBytes()).powZn(x).getImmutable(), hashG(id_o.toBytes()));
        au = new KeyPair(hashG(id_u.toBytes()).powZn(x).getImmutable(), hashG(id_u.toBytes()));

        k = bp.pairing(ao.getSk(), au.getPk()).getImmutable();
    }


    // 获取 CID
    public static Element getCID(){
        Element k1 = bp.pairing(ao.getSk(), au.getPk()).getImmutable();
        // 注意这里的命名要和生成元 h 区分开
        Element h1 = hashG(ByteUtil.joinByteArray(ao.getPk().toBytes(), au.getPk().toBytes(), k1.toBytes())).getImmutable();
        return h1.powZn(co.getSk()).mul(h).getImmutable();
    }

    // 获取 TID
    public static Element getTID(){
        Element k2 = bp.pairing(au.getSk(), ao.getPk()).getImmutable();
        Element h2 = hashG(ByteUtil.joinByteArray(ao.getPk().toBytes(), au.getPk().toBytes(), k2.toBytes())).getImmutable();
        return bp.pairing(h2.powZn(tu.getSk()), co.getPk()).getImmutable();
    }

    public static boolean auth(Element CID, Element TID){
        Element left = bp.pairing(CID, tu.getPk());
        Element right = TID.mul(bp.pairing(tu.getPk(), h));
        System.out.println("left == right == " + left);
        return left.isEqual(right);
    }

    public static void authTest(){
        // 2、身份认证
        // 身份认证参数初始化
        System.out.println("身份双向认证\n=======================");
        authKeyInit();
        System.out.println("id_o: " + id_o + "\nid_u: " + id_u + "\nao: " + ao + "\nau: " + au + "\nk: " + k);

        // 计算 CID、TID
        Element CID = getCID(), TID = getTID();
        System.out.println("CID: " + CID + "\nTID: " + TID);

        // 验证其双线性
        if(auth(CID, TID)){
            System.out.println("身份认证成功");
        } else {
            System.out.println("身份认证失败");
        }

        System.out.println("=======================\n");
    }







    // 索引矩阵
    // 列为文档 ID，行为关键词，值为相关性评分（为什么是 String，因为要对 int 进行 VFE Plus 加密，得到八进制字符串）
    private static String[][] matrix;
    // 记录加密后的关键词和在索引矩阵中的下标位置
    private static Element[] KEYWORD;
    // 记录加密后的文档 ID 和在索引矩阵中的下标
    private static String[] ID;
    // 文档集
    private static Map<String, String> docs;
    // 文档名数组，用于读取本地文件
    private static List<String> names = new ArrayList<>(Arrays.asList("1", "2", "3", "4", "5"));
    // BM25 参数
    private static double k1 = 1.2, b = 0.75, k3 = 1.4, a = 1;

    // 分组加密密钥和加密方式
    private static SecretKey secretKey;
    private static byte[] iv;

    private static void matrixInit() throws NoSuchAlgorithmException, InvalidAlgorithmParameterException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException {
        System.out.println("索引矩阵构建\n=======================");

        // 用于记录关键词和其在矩阵 matrix 中对应的下标（行数）
        Map<String, Integer> keyword = new HashMap<>();

        // 用于记录文档 ID 和其在矩阵 matrix 中对应的下标（列数）
        Map<String, Integer> id = new HashMap<>();

        // 用于记录关键词在文档集中出现的频率，在 m 个文档中出现则记为 m
        Map<String, Integer> n = new HashMap<>();
        docs = new HashMap<>();

        int count = 0;
        for(String name: names){
            // 从文件中读入文档
            docs.put(name, IOUtil.readDocs(name));
            // 记录文档并且规定其在矩阵 matrix 中对应的下标
            id.put(name, count++);
        }
//        System.out.println(docs);
        // 记录文档个数
        int N = id.size();

        int[] d = new int[id.size()];
        for(String name: id.keySet()){
            // 遍历文档 ID，从 Map id 里拿 id 对应的下标
            int index = id.get(name);
            // 记录各个文档的词汇总数，index 为 id 表中的值
            // 取的时候一定要注意，先从 id 表中通过文档名取出下标，然后再通过下标去操作 d 数组或 matrix 数组
            d[index] = docs.get(name).split(" ").length;
        }
        // 求文档包含的平均词数
        int avg = Arrays.stream(d).sum() / N;


        count = 0;
        // 从 docs 表中取出文档内容
        // 通过分词算法提取关键词并存入 keyword 表，值为其在二维数组 matrix 中的下标
        for(String content: docs.values()){
            List<String> l = DocsUtil.getKeyword("", content);
//            System.out.println(l);
            for(String s: l){
                if(!keyword.containsKey(s)){
                    // 放入关键词，同时规定关键词在矩阵 matrix 中的下标
                    keyword.put(s, count++);
                    // 统计关键词在文档中出现次数
                    n.put(s, 1);
                } else {
                    // 更新关键词在各文档中的出现次数
                    n.put(s, n.get(s)+1);
                }
            }
        }

        System.out.println("文档 ID 序列（加密前）: " + id);
        System.out.println("关键词序列（加密前）: " + keyword);
        System.out.println("关键词在文档集中被包含的次数（n(q_i)）: " + n);


        matrix = new String[keyword.size()][id.size()];
//        System.out.println(keyword.size());
//        System.out.println(id.size());


        for(String q: keyword.keySet()){
            // matrix 行
            int i = keyword.get(q);
            for(String s: id.keySet()){
                // matrix 列
                int j = id.get(s);
//                System.out.println(i + ":" + j);
                // 计算 R
                double idf = Math.log((N + 1) / (n.get(q) + 0.5));
//                System.out.println(idf);
                // 计算第 i 个关键词在第 j 个文档中的出现频率
                int f = DocsUtil.getMatch(q, docs.get(s));
                // 若为长文档，需要额外处理 f，加一个常数 a=1
                if(d[j] > 400){
                    f += a;
                }
//                System.out.println(f);
                double R = (idf * (f * (k1+1) / (f + k1 * (1 - b + b * d[j] / avg))) * (f * (k3 + 1) / (k3 + f)));
                String encode = VFEPlusUtil.encode((int)R);
                matrix[i][j] = encode;
            }
        }


        // 初始化分组加密参数
        secretKey = AESUtil.generateKey();
        iv = AESUtil.genIV();
        ID = new String[id.size()];
        for(String s: id.keySet()){
            String c = AESUtil.encrypt(s, secretKey, iv);
            int index = id.get(s);
            ID[index] = c;
        }
        System.out.println("文档 ID 序列（AES 加密后）: " + Arrays.toString(ID));

        KEYWORD = new Element[keyword.size()];
        // 在 keyword 表中加密关键词，得到最终加密后的关键词表 KEYWORD
        for(String w: keyword.keySet()){
//            System.out.println("进来了");
            Element h1 = hashZ(ByteUtil.joinByteArray(k.toBytes(), w.getBytes()));
//            System.out.println(h1);
            Element h2 = hashZ(ByteUtil.joinByteArray(h1.toBytes(), co.getPk().toBytes()));
//            System.out.println(h2);
            Element x = co.getSk().mul(h2).getImmutable();
//            System.out.println(x);
            Element c = svr.getPk().powZn(x).getImmutable();
//            System.out.println("normal");
            int index = keyword.get(w);
            KEYWORD[index] = c;
//            if(w.equals("Jacques")){ System.out.println(c);  }
        }
//        System.out.println("关键词序列（公钥加密后）: " + Arrays.toString(KEYWORD));


//        for(Integer[] row: matrix){
//            for(Integer i: row){
//                System.out.print(i + "       ");
//            }
//            System.out.println();
//        }
        System.out.println("=======================\n");
    }


    public static Element getT(String w){
        return hashZ(ByteUtil.joinByteArray(k.toBytes(), w.getBytes()));
    }

    public static int find(String str){
        // 计算陷门
        Element t = getT(str);
        // 计算密文
        Element word = svr.getPk().powZn(co.getSk().mul(hashZ(ByteUtil.joinByteArray(t.toBytes(), co.getPk().toBytes()))));
//        System.out.println(word);
        // 在关键词序列中匹配密文
        for(int i = 0; i < KEYWORD.length; i++){
            Element w = KEYWORD[i];
            if(w.isEqual(word)){
                return i;
            }
        }
        return -1;
    }

    // 获取查询向量，在 words 与 KEYWORD 匹配的地方置 1，否则置 0
    public static List<Integer> getQuery(List<String> words){
        List<Integer> query = new ArrayList<>();
        // 初始化查询向量
        for(int i = 0; i < KEYWORD.length; i++){
            query.add(0);
        }
        // 匹配成功置 1
        for(String w: words){
            int index = find(w);
            if(index >= 0){
//                System.out.println(index);
                query.set(index, 1);
            }
        }
        return query;
    }

    // 获取各个文档的 BM25 分数，通过查询向量和索引矩阵的每列（代表每个文档）做内积得到
    public static List<Integer> getBM25(List<String> words){
        System.out.println("计算查询向量的 BM25 相关性评分\n=======================");
        System.out.println("查询包含的关键词: " + words);
        // 获取查询向量，长度为 KEYWORD.length
        List<Integer> query = getQuery(words);
        System.out.println("对应的查询向量: " + query);
        // 每个文档的 BM25 分数
        // 初始化相关性评分
        List<Integer> bm25 = new ArrayList<>();
        for(int j = 0; j < ID.length; j++){
            int grade = 0;
            for (int i = 0; i < KEYWORD.length; i++) {
//                System.out.println(matrix[index][j]);
                int decode = VFEPlusUtil.decode(matrix[i][j]);
                grade += decode * query.get(i);
            }
            bm25.add(grade);
        }
        System.out.println("=======================\n");
        return bm25;
    }

    public static void main(String[] args) {
        systemInit();
        authTest();
        try{
            matrixInit();
        }catch (Exception e){
            e.printStackTrace();
        }

        List<String> words = new ArrayList<>();
        words.add("K");
        words.add("Mon");
        words.add("May");
        words.add("Phillip");
        words.add("Belden");
        words.add("PDT");
        words.add("From");
        words.add("phillip");
        System.out.println("BM25 分数: " + getBM25(words));
//        JPBCTest();

    }


    public static void JPBCTest(){

        Pairing bp = PairingFactory.getPairing("a.properties");

        // 二、选择群上的元素
        Field G1 = bp.getG1();
        Field G2 = bp.getG2();
        Field Zr = bp.getZr();
        Element u = G1.newRandomElement().getImmutable();
        Element v = G2.newRandomElement().getImmutable();
        Element a = Zr.newRandomElement().getImmutable();
        Element b = Zr.newRandomElement().getImmutable();

        // 三、计算等式左半部分
        Element ua = u.powZn(a);
        Element vb = v.powZn(b);
        Element left = bp.pairing(ua,vb);

        // 四、计算等式右半部分
        Element euv = bp.pairing(u,v).getImmutable();
        Element ab = a.mul(b);
        Element right = euv.powZn(ab);

        if (left.isEqual(right)) {
            System.out.println("Yes");
        } else {
            System.out.println("No");
        }

    }


}
