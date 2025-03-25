package com.hivemind.controller;

import com.hivemind.configuration.JWTUserData;
import com.hivemind.controller.response.PrivateChatMessage;
import com.hivemind.controller.response.GroupChatMessage;
import com.hivemind.controller.response.PrivateMessage;
import com.hivemind.entity.User;
import com.hivemind.exception.UserNotFoundException;
import com.hivemind.repository.UserRepository;
import com.hivemind.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    private SimpUserRegistry userRegistry;

    @MessageMapping("/globalChat")
    @SendTo("/topic/globalChat")
    public GroupChatMessage sendMessageToGlobalChat(@Payload String message, Principal principal) throws Exception {
        String timestamp = LocalDateTime.now()
                                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return new GroupChatMessage(principal.getName(), message, timestamp);
    }

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload PrivateMessage message, Principal principal) {
        messagingTemplate.convertAndSendToUser(
                message.recipient(),
                "/queue/messages",
                message
        );
    }

}