package com.hivemind.repository;

import com.hivemind.entity.GlobalMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GlobalMessageRepository extends JpaRepository<GlobalMessage, UUID> {
}
