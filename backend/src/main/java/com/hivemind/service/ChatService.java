package com.hivemind.service;

import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;
import com.hivemind.repository.PrivateMessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final PrivateMessageRepository privateMessageRepository;

    @Transactional
    public int markConversationAsRead(Long userId, Long contactId) {
        return privateMessageRepository.markMessagesAsRead(userId, contactId);
    }

    public PrivateMessage save(PrivateMessage privateMessage) {
        return privateMessageRepository.save(privateMessage);
    }

    public List<PrivateMessage> getConversationHistory(Long userId, Long contactId) {
        return privateMessageRepository.findConversation(userId, contactId);
    }

}
