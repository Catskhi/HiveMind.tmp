package com.hivemind.service;

import com.hivemind.controller.response.ContactResponse;
import com.hivemind.entity.Contact;
import com.hivemind.entity.PrivateMessage;
import com.hivemind.entity.User;
import com.hivemind.mapper.ContactMapper;
import com.hivemind.mapper.UserMapper;
import com.hivemind.repository.ContactRepository;
import com.hivemind.repository.PrivateMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final PrivateMessageRepository privateMessageRepository;

    public ContactResponse getContactResponse(Contact contact) {
        int unreadMessagesCount = getUnreadMessagesFromContact(contact);

        return ContactResponse.builder()
                .contact(UserMapper.toPublicUserResponse(contact.getContact()))
                .lastMessageAt(contact.getLastMessageAt())
                .unreadMessagesCount(unreadMessagesCount)
                .build();
    }

    public int getUnreadMessagesFromContact(Contact contact) {
        Pageable limit = PageRequest.of(0, 10);
        List<PrivateMessage> unreadMessages = privateMessageRepository.findUnreadMessagesFromContact(contact.getUser().getId(), contact.getContact().getId(), limit);
        return unreadMessages.size();
    }

    public Contact createOrUpdateContact(User user, User contactUser, ZonedDateTime lastMessageTime) {
        return contactRepository.findByUserAndContact(user, contactUser)
                .map(contact -> {
                    contact.setLastMessageAt(lastMessageTime);
                    return contactRepository.save(contact);
                })
                .orElseGet(() -> createNewContact(user, contactUser, lastMessageTime));

    }

    public Contact createNewContact(User user, User contactUser, ZonedDateTime lastMessageTime) {
        Contact newContact = Contact.builder()
                .user(user)
                .contact(contactUser)
                .lastMessageAt(lastMessageTime)
                .createdAt(ZonedDateTime.now())
                .build();
        return contactRepository.save(newContact);
    }

    public List<Contact> findByUserId(Long userId) {
        return contactRepository.findByUserIdOrderByLastMessageAtDesc(userId);
    }
}
