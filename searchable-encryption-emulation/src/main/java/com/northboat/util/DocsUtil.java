package com.northboat.util;


import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.dictionary.stopword.CoreStopWordDictionary;
import com.hankcs.hanlp.seg.common.Term;

import java.util.*;

/**
 * TextRank关键词提取
 *
 * @author hankcs
 */
public class DocsUtil {

    // 统计关键词的出现次数
    public static int getMatch(String keyword, String docs){
        int count = 0;//count用来接收子字符串substr在字符串str中出现的次数
        //使用for循环从字符串的0位置开始循环截取和子字符串长度相同的字符串；
        //然后判断截取的字符串是否和子字符串substr相同，若相同则count加一。
        for(int i = 0; i < docs.length()+1-keyword.length();i++) {
            if(docs.startsWith(keyword, i)) {
                count++;
            }
        }
        return count;
    }

//    public static final int nKeyword = 10;
    /**
     * 阻尼系数（ＤａｍｐｉｎｇＦａｃｔｏｒ），一般取值为0.85
     */
    static final float d = 0.85f;
    /**
     * 最大迭代次数
     */
    static final int max_iter = 200;
    static final float min_diff = 0.001f;

    public DocsUtil() {
        // jdk bug : Exception in thread "main" java.lang.IllegalArgumentException: Comparison method violates its general contract!
        System.setProperty("java.util.Arrays.useLegacyMergeSort", "true");
    }

    public static List<String> getKeyword(String title, String content) {
        List<Term> termList = HanLP.segment(title + content);
//        System.out.println(termList);
        List<String> wordList = new ArrayList<String>();
        for (Term t : termList) {
            if (shouldInclude(t)) {
                wordList.add(t.word);
            }
        }
//        System.out.println(wordList);
        Map<String, Set<String>> words = new HashMap<String, Set<String>>();
        Queue<String> que = new LinkedList<String>();
        for (String w : wordList) {
            if (!words.containsKey(w)) {
                words.put(w, new HashSet<String>());
            }
            que.offer(w);
            if (que.size() > 5) {
                que.poll();
            }

            for (String w1 : que) {
                for (String w2 : que) {
                    if (w1.equals(w2)) {
                        continue;
                    }
                    words.get(w1).add(w2);
                    words.get(w2).add(w1);
                }
            }
        }
//        System.out.println(words);
        Map<String, Float> score = new HashMap<String, Float>();
        for (int i = 0; i < max_iter; ++i) {
            Map<String, Float> m = new HashMap<String, Float>();
            float max_diff = 0;
            for (Map.Entry<String, Set<String>> entry : words.entrySet()) {
                String key = entry.getKey();
                Set<String> value = entry.getValue();
                m.put(key, 1 - d);
                for (String other : value) {
                    int size = words.get(other).size();
                    if (key.equals(other) || size == 0) continue;
                    m.put(key, m.get(key) + d / size * (score.get(other) == null ? 0 : score.get(other)));
                }
                max_diff = Math.max(max_diff, Math.abs(m.get(key) - (score.get(key) == null ? 0 : score.get(key))));
            }
            score = m;
            if (max_diff <= min_diff) break;
        }
        List<Map.Entry<String, Float>> entryList = new ArrayList<Map.Entry<String, Float>>(score.entrySet());

        Collections.sort(entryList, new Comparator<Map.Entry<String, Float>>() {
            @Override
            public int compare(Map.Entry<String, Float> o1, Map.Entry<String, Float> o2) {
                return (o1.getValue() - o2.getValue() > 0 ? -1 : 1);
            }
        });

//        System.out.println(entryList);
        List<String> result = new ArrayList<>();
        for (int i = 0; i < entryList.size(); i++) {
//            result += entryList.get(i).getKey() + '#';
            result.add(entryList.get(i).getKey());
        }
        return result;
    }

    public static void main(String[] args) {
//  eg:
//  input: 程序员(英文Programmer)是从事程序开发、维护的专业人员。一般将程序员分为程序设计人员和程序编码人员，但两者的界限并不非常清楚，特别是在中国。软件从业人员分为初级程序员、高级程序员、系统分析员和项目经理四大类。
//  output: [程序员, 人员, 程序, 分为, 开发, 非常, 软件, 系统, 维护, 并不]
//        Scanner s = new Scanner(System.in);
//        String content = s.nextLine();
        String content = "what the fuck neo, what are you doing now, you fucking killed a police, we are done fuck";
        List<String> keywords = new DocsUtil().getKeyword("", content);
        for(String s: keywords){
            System.out.print(s + ", ");
        }

    }

    /**
     * 是否应当将这个term纳入计算，词性属于名词、动词、副词、形容词
     *
     * @param term
     * @return 是否应当
     */
    public static boolean shouldInclude(Term term) {
        return CoreStopWordDictionary.shouldInclude(term);
    }
}
