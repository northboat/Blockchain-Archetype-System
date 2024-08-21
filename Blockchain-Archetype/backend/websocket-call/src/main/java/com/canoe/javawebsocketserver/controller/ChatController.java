package com.canoe.javawebsocketserver.controller;


import com.canoe.javawebsocketserver.socket.WebSocketServer;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ChatController {


    @RequestMapping("/park")
    public String park(HttpSession session, Model model){
        int count = WebSocketServer.getOnlineCount() + 1;

        //System.out.println(WebSocketServer.getWebSocketSet().size());

        model.addAttribute("count", count);
        model.addAttribute("room", "park");
        return "park";
    }

    @RequestMapping("/generate")
    public String generate(HttpSession session, Model model){
        int count = WebSocketServer.getOnlineCount() + 1;

        //System.out.println(WebSocketServer.getWebSocketSet().size());

        model.addAttribute("count", count);
        model.addAttribute("room", "park");
        return "generate";
    }

}
