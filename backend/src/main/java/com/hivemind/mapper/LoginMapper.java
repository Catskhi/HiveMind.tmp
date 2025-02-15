package com.hivemind.mapper;

import com.hivemind.controller.response.LoginResponse;
import com.hivemind.entity.User;
import lombok.experimental.UtilityClass;

import java.util.Optional;

@UtilityClass
public class LoginMapper {

    public LoginResponse toLoginResponse(String token, User user) {
        return LoginResponse.builder()
                .token(token)
                .publicKey(user.getPublicKey())
                .privateKey(Optional.ofNullable(user.getPrivateKey()))
                .build();
    }

}
