package com.hivemind.service;

import com.hivemind.entity.GlobalMessage;
import com.hivemind.entity.PrivateMessage;
import com.hivemind.repository.GlobalMessageRepository;
import com.hivemind.repository.PrivateMessageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${CHAT_SECRET}")
    private String secretKey;

    private final PrivateMessageRepository privateMessageRepository;
    private final GlobalMessageRepository globalMessageRepository;

    @Transactional
    public int markConversationAsRead(Long userId, Long contactId) {
        return privateMessageRepository.markMessagesAsRead(userId, contactId);
    }

    public GlobalMessage saveGlobalMessage(GlobalMessage globalMessage) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(Base64.getDecoder().decode(secretKey), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encryptedBytes = cipher.doFinal(globalMessage.getEncryptedMessage().getBytes(StandardCharsets.UTF_8));
            String encryptedMessage = Base64.getEncoder().encodeToString(encryptedBytes);

            globalMessage.setEncryptedMessage(encryptedMessage);
            return globalMessageRepository.save(globalMessage);
        } catch (Exception e) {
            throw new RuntimeException("Error on message encryption.", e);
        }
    }

    public List<GlobalMessage> getGlobalConversationHistory() {
        Pageable pageable = PageRequest.of(0, 50, Sort.by(Sort.Direction.ASC, "createdAt"));
        return globalMessageRepository.findAll(pageable).getContent();
    }

    public PrivateMessage savePrivateMessage(PrivateMessage privateMessage) {
        return privateMessageRepository.save(privateMessage);
    }

    public List<PrivateMessage> getConversationHistory(Long userId, Long contactId) {
        return privateMessageRepository.findConversation(userId, contactId);
    }

    public String decryptAES(String encryptedMessage) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(Base64.getDecoder().decode(secretKey), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedMessage);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed",  e);
        }
    }

}
