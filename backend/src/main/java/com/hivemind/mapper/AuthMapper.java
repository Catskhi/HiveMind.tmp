package com.hivemind.mapper;

import com.hivemind.controller.response.LoginResponse;
import com.hivemind.controller.response.RegisterResponse;
import com.hivemind.controller.response.UserResponse;
import com.hivemind.entity.User;
import lombok.experimental.UtilityClass;

import java.util.Optional;

@UtilityClass
public class AuthMapper {

    public LoginResponse toLoginResponse(String token, User user) {
        return LoginResponse.builder()
                .token(token)
                .publicKey(user.getPublicKey())
                .privateKey(Optional.ofNullable(user.getPrivateKey()))
                .build();
    }

    public static RegisterResponse toRegisterResponse(User user, String token) {
        return RegisterResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .publicKey(user.getPublicKey())
                .privateKey(user.getTempPrivateKey())
                .token(token)
                .build();
    }

}
