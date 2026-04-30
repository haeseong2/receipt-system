package com.haeseong.receipt_app.service.utile;

import com.haeseong.receipt_app.domain.User;
import com.haeseong.receipt_app.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SessionUserService {

    private static final String LOGIN_USER = "LOGIN_USER";
    private final UserRepository userRepository;

    public User getLoginUser(HttpSession session){
        Long userId = (Long) session.getAttribute(LOGIN_USER);

        if(userId == null){
            throw new RuntimeException("로그인 필요");
        }
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자 없음"));
    }
}