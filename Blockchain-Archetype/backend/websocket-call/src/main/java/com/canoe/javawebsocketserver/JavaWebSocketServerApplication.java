package com.canoe.javawebsocketserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
@EnableWebSocket
public class JavaWebSocketServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaWebSocketServerApplication.class, args);
    }

}
