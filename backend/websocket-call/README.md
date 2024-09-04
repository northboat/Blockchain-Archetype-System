## WebSocket 服务器

### 环境

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.10</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.canoe</groupId>
    <artifactId>Java-WebSocket-Server</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>Java-WebSocket-Server</name>
    <description>Java-WebSocket-Server</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>3.0.1</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>

        <!--junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <image>
                        <builder>paketobuildpacks/builder-jammy-base:latest</builder>
                    </image>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

不连接数据库，SpringBoot 启动报错

```java
@SpringBootApplication
public class JavaWebSocketServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(JavaWebSocketServerApplication.class, args);
    }
}
```

改为

```java
@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
public class JavaWebSocketServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(JavaWebSocketServerApplication.class, args);
    }
}
```

### WebSocket

依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

WebSocketConfig

```java
package com.canoe.javawebsocketserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

@Configuration
public class WebSocketConfig {
    /**
     * WebSocket 服务器节点
     *
     * 如果使用独立的servlet容器，而不是直接使用springboot的内置容器，就不要注入ServerEndpointExporter，因为它将由容器自己提供和管理
     * @return
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

}
```

WebSocketServer

```java
package com.canoe.javawebsocketserver.socket;

import com.canoe.javawebsocketserver.util.CallUtil;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@Slf4j
@Service
@ServerEndpoint("/chat/{sid}")
public class WebSocketServer {
    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;
    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。
    private static final CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<WebSocketServer>();

    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    //接收sid
    private String sid = "";

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("sid") String sid) {
        this.session = session;
        this.sid = sid;
        webSocketSet.add(this);     //加入set中
        addOnlineCount();           //在线数加1
        try {
            sendMessage("Connection Test Message");
            log.info("有新窗口开始监听:" + sid + ", 当前总共在线人数为:" + getOnlineCount());
        } catch (IOException e) {
            log.error("websocket IO Exception");
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  //从set中删除
        subOnlineCount();           //在线数减1
        //断开连接情况下，更新主板占用情况为释放
        log.info("释放的sid为：" + sid);
        //这里写你 释放的时候，要处理的业务
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     * @ Param message 客户端发送过来的消息
     */
    // 全双工通信，服务器接收到客户端的消息后进行处理，可以是分发，可以是其他
    // 这里是将信息发送给 sid 相同的所有连接
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("收到来自窗口 " + sid + " 的信息:" + message);
        String feedback = CallUtil.test();
        //群发消息
        for (WebSocketServer item : webSocketSet) {
            if (item.sid.equals(sid)) {
                try {
                    item.sendMessage(feedback);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * @ Param session
     * @ Param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }

    /**
     * 实现服务器主动推送
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    /**
     * 群发自定义消息
     */
    public static void sendInfo(String message, @PathParam("sid") String sid) throws IOException {
        log.info("推送消息到窗口" + sid + "，推送内容:" + message);

        for (WebSocketServer item : webSocketSet) {
            try {
                //这里可以设定只推送给这个sid的，为null则全部推送
                if (sid == null) {
                    item.sendMessage(message);
                } else if (item.sid.equals(sid)) {
                    item.sendMessage(message);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocketServer.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocketServer.onlineCount--;
    }

    public static CopyOnWriteArraySet<WebSocketServer> getWebSocketSet() {
        return webSocketSet;
    }
}
```



### 本地调用 C 程序

util/Call.java

```java
package com.canoe.javawebsocketserver.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class Call {

    public static String test(){
        try{
            System.out.println("收到前端请求，尝试运行本地C程序");
            // ipconfig
            // dir
            // E:\File\XDU\Java-WebSocket-Server\src\main\resources\c-lib\test
            Process pro = Runtime.getRuntime().exec("E:\\File\\XDU\\Java-WebSocket-Server\\src\\main\\resources\\c-lib\\test.exe");
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
```

### 前端请求方式

### 其他

#### 跨域请求

websocket 4.15 版本以下默认允许跨域

#### 构建 jar 包时报错

测试报错

```
jakarta.websocket.server.ServerContainer not available
```

在测试类中添加

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
```

