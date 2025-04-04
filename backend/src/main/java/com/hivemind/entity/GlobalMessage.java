package com.hivemind.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "global_messages")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GlobalMessage {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "encrypted_message", nullable = false, columnDefinition = "TEXT")
    private String encryptedMessage;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt = ZonedDateTime.now();
}
