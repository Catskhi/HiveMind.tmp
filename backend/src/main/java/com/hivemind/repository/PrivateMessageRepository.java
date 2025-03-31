package com.hivemind.repository;

import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface PrivateMessageRepository extends JpaRepository<PrivateMessage, UUID> {

    @Query(value = """
            SELECT msg FROM PrivateMessage msg
            WHERE msg.sender.id = :contactId
            AND msg.recipient.id = :userId
            AND msg.isRead = false
            ORDER BY msg.createdAt DESC
            """)
    List<PrivateMessage> findUnreadMessagesFromContact(
            @Param("userId") Long userId,
            @Param("contactId") Long contactId,
            Pageable pageable
    );

    @Modifying
    @Query("""
            UPDATE PrivateMessage msg
            SET msg.isRead = true
            WHERE msg.sender.id = :contactId
            AND msg.recipient.id = :userId
            AND msg.isRead = false
            """)
    int markMessagesAsRead(
            @Param("userId") Long userId,
            @Param("contactId") Long contactId
    );

    @Query("""
            SELECT m FROM PrivateMessage m
            WHERE (m.sender.id = :userId1 AND m.recipient.id = :userId2)
            OR    (m.sender.id = :userId2 AND m.recipient.id = :userId1)
            ORDER BY m.createdAt ASC
            """)
    List<PrivateMessage> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
