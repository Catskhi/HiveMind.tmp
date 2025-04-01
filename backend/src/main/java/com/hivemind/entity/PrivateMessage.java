package com.hivemind.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PrivateMessage {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(name = "encrypted_message", nullable = false, columnDefinition = "TEXT")
    private String encryptedMessage;

    @Column(name = "encrypted_key_recipient", nullable = false, columnDefinition = "TEXT")
    private String encryptedKeyRecipient;

    @Column(name = "encrypted_key_sender", nullable = false, columnDefinition = "TEXT")
    private String encryptedKeySender;

    @Column(name = "iv", nullable = false,columnDefinition = "TEXT")
    private String iv;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;
}
