package com.hivemind.controller;

import com.hivemind.configuration.JWTUserData;
import com.hivemind.controller.request.MarkReadRequest;
import com.hivemind.controller.request.PrivateMessageRequest;
import com.hivemind.controller.response.GroupChatMessage;
import com.hivemind.controller.response.PrivateMessageResponse;
import com.hivemind.controller.response.PublicUserResponse;
import com.hivemind.entity.Contact;
import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;
import com.hivemind.exception.UserNotFoundException;
import com.hivemind.mapper.ChatMapper;
import com.hivemind.mapper.ContactMapper;
import com.hivemind.mapper.UserMapper;
import com.hivemind.service.ChatService;
import com.hivemind.service.ContactService;
import com.hivemind.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final UserService userService;
    private final ChatService chatService;
    private final ContactService contactService;

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
        Optional<User> sender = userService.findByName(principal.getName());
        Optional<User> recipient = userService.findByName(message.recipient());
        ZonedDateTime createdAt = ZonedDateTime.now();
        if (sender.isEmpty() || recipient.isEmpty()) {
            throw new UserNotFoundException("Sender user or recipient user not found.");
        }
        PrivateMessage savedPrivateMessage = chatService.save(ChatMapper.toPrivateMessage(message, sender.get(), recipient.get(), createdAt));

        Contact senderContact =  contactService.createOrUpdateContact(sender.get(), recipient.get(), savedPrivateMessage.getCreatedAt());
        Contact recipientContact = contactService.createOrUpdateContact(recipient.get(), sender.get(), savedPrivateMessage.getCreatedAt());

        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/contacts",
                contactService.getContactResponse(senderContact)
        );
        messagingTemplate.convertAndSendToUser(
                message.recipient(),
                "/queue/contacts",
                contactService.getContactResponse(recipientContact)
        );

        PrivateMessageResponse response = ChatMapper.toPrivateMessageResponse(savedPrivateMessage);
        messagingTemplate.convertAndSendToUser(
                message.recipient(),
                "/queue/messages",
                response
        );
        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/messages",
                response
        );
    }

    @MessageMapping("/chat/mark-read")
    public void markMessagesAsRead(@Payload MarkReadRequest request, Principal principal) {
        User currentUser = userService.findByName(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not authenticated"));
        User contactUser = userService.findByName(request.contactUsername())
                .orElseThrow(() -> new UserNotFoundException("Contact user not found."));

        int updatedUnreadMessagesCount = chatService.markConversationAsRead(
                currentUser.getId(),
                contactUser.getId()
        );
    }

}