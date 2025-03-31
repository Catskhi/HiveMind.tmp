package com.hivemind.controller;

import com.hivemind.configuration.JWTUserData;
import com.hivemind.controller.response.ContactResponse;
import com.hivemind.controller.response.PrivateMessageResponse;
import com.hivemind.entity.Contact;
import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;
import com.hivemind.exception.UserNotFoundException;
import com.hivemind.mapper.ChatMapper;
import com.hivemind.mapper.ContactMapper;
import com.hivemind.service.ChatService;
import com.hivemind.service.ContactService;
import com.hivemind.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final UserService userService;
    private final ChatService chatService;

    @GetMapping()
    public ResponseEntity<List<ContactResponse>> getContacts() {
        JWTUserData authentication = (JWTUserData) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        List<Contact> contacts = contactService.findByUserId(authentication.id());
        return ResponseEntity.ok(contacts.stream().map(contactService::getContactResponse).toList());
    }

    @GetMapping("/{contactName}/messages")
    public ResponseEntity<List<PrivateMessageResponse>> getPrivateConversationHistory(@PathVariable String contactName) {
        JWTUserData authentication = (JWTUserData) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        User currentUser = userService.findByUsername(authentication.name());

        User contactUser = userService.findByUsername(contactName);

        List<PrivateMessage> messages = chatService.getConversationHistory(currentUser.getId(), contactUser.getId());

        return ResponseEntity.ok(messages.stream().map(ChatMapper::toPrivateMessageResponse).toList());
    }
}
