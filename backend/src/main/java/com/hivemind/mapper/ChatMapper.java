package com.hivemind.mapper;

import com.hivemind.controller.request.PrivateMessageRequest;
import com.hivemind.controller.response.PrivateMessageResponse;
import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class ChatMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static PrivateMessage toPrivateMessage(PrivateMessageRequest request, User sender, User recipient, ZonedDateTime createdAt) {
        return PrivateMessage.builder()
                .sender(sender)
                .encryptedKeySender(request.encryptedKeySender())
                .recipient(recipient)
                .encryptedKeyRecipient(request.encryptedKeyRecipient())
                .encryptedMessage(request.encryptedMessage())
                .iv(request.iv())
                .createdAt(createdAt)
                .build();
    }

    public static PrivateMessageResponse toPrivateMessageResponse(PrivateMessage privateMessage) {
        return PrivateMessageResponse.builder()
                .sender(privateMessage.getSender().getName())
                .encryptedKeySender(privateMessage.getEncryptedKeySender())
                .recipient(privateMessage.getRecipient().getName())
                .encryptedKeyRecipient(privateMessage.getEncryptedKeyRecipient())
                .iv(privateMessage.getIv())
                .encryptedMessage(privateMessage.getEncryptedMessage())
                .timestamp(privateMessage.getCreatedAt().format(FORMATTER))
                .build();
    }
}
