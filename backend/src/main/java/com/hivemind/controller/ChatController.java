package com.hivemind.controller;

import com.hivemind.configuration.JWTUserData;
import com.hivemind.controller.response.GreetingMessage;
import com.hivemind.controller.request.HelloMessage;
import com.hivemind.controller.response.GroupChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.security.Principal;

@Controller
public class ChatController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public GreetingMessage greeting(HelloMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new GreetingMessage("Hello, " + HtmlUtils.htmlEscape(message.name()) + "!");
    }

    @MessageMapping("/globalChat")
    @SendTo("/topic/globalChat")
    public GroupChatMessage sendMessageToGlobalChat(String message, Principal principal) throws Exception {
        JWTUserData user = (JWTUserData) ((Authentication) principal).getPrincipal();
        return new GroupChatMessage(user.name(), message);
    }

}