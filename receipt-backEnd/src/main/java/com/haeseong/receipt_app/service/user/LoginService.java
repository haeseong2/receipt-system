package com.haeseong.receipt_app.service.user;

import com.haeseong.receipt_app.domain.User;
import com.haeseong.receipt_app.dto.user.LoginRequest;
import com.haeseong.receipt_app.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User login(LoginRequest request){
        User user = userRepository.findByLoginId(request.getLoginId()).orElseThrow(()
                -> new RuntimeException("USER_NOT_FOUND"));
        System.out.println("DB 해시 : " + user.getPasswordHash());

        boolean match = passwordEncoder.matches(request.getPassword(),user.getPasswordHash());
        System.out.println("비교결과 : " + match);

        if(!match){
            throw new RuntimeException("PASSWORD_INVALID");
        }

        return user;
    }
}