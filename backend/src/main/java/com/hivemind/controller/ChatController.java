package com.hivemind.controller;

import com.hivemind.controller.request.GlobalMessageRequest;
import com.hivemind.controller.request.MarkReadRequest;
import com.hivemind.controller.request.PrivateMessageRequest;
import com.hivemind.controller.response.GlobalMessageResponse;
import com.hivemind.controller.response.PrivateMessageResponse;
import com.hivemind.entity.Contact;
import com.hivemind.entity.GlobalMessage;
import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;
import com.hivemind.exception.UserNotFoundException;
import com.hivemind.mapper.ChatMapper;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.ZonedDateTime;
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
    public GlobalMessageResponse sendMessageToGlobalChat(@Payload GlobalMessageRequest message, Principal principal) throws Exception {
        Optional<User> sender = userService.findByName(principal.getName());
        ZonedDateTime createdAt = ZonedDateTime.now();
        if (sender.isEmpty()) {
            throw new UserNotFoundException("Sender user not found.");
        }
        GlobalMessage savedGlobalMessage = chatService.saveGlobalMessage(ChatMapper.toGlobalMessage(message, sender.get(), createdAt));
        savedGlobalMessage.setEncryptedMessage(chatService.decryptAES(savedGlobalMessage.getEncryptedMessage()));
        return ChatMapper.toGlobalMessageResponse(savedGlobalMessage);
    }

    @GetMapping("/globalChat/messages")
    public ResponseEntity<List<GlobalMessageResponse>> getGlobalConversationHistory() {
        List<GlobalMessage> messages = chatService.getGlobalConversationHistory();
        messages.forEach(message -> {
            String decryptedMEssage = chatService.decryptAES(message.getEncryptedMessage());
            message.setEncryptedMessage(decryptedMEssage);
        });

        return ResponseEntity.ok(messages.stream().map(ChatMapper::toGlobalMessageResponse).toList());
    }

    @MessageMapping("/chat")
    public void sendPrivateMessage(@Payload PrivateMessageRequest message, Principal principal) {
        Optional<User> sender = userService.findByName(principal.getName());
        Optional<User> recipient = userService.findByName(message.recipient());
        ZonedDateTime createdAt = ZonedDateTime.now();
        if (sender.isEmpty() || recipient.isEmpty()) {
            throw new UserNotFoundException("Sender user or recipient user not found.");
        }
        PrivateMessage savedPrivateMessage = chatService.savePrivateMessage(ChatMapper.toPrivateMessage(message, sender.get(), recipient.get(), createdAt));

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