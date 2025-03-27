package com.hivemind.controller;

import com.hivemind.controller.request.PrivateMessageRequest;
import com.hivemind.controller.response.GroupChatMessage;
import com.hivemind.controller.response.PrivateMessageResponse;
import com.hivemind.entity.User;
import com.hivemind.repository.UserRepository;
import com.hivemind.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
    public void sendPrivateMessage(@Payload PrivateMessageRequest message, Principal principal) {
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        PrivateMessageResponse response = new PrivateMessageResponse(
                principal.getName(),
                message.encryptedKeySender(),
                message.recipient(),
                message.encryptedKeyRecipient(),
                message.iv(),
                message.encryptedMessage(),
                timestamp
        );
        messagingTemplate.convertAndSendToUser(
                message.recipient(),
                "/queue/messages",
                response
        );
        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "queue/messages",
                response
        );
    }

}