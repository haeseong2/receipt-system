package com.haeseong.receipt_app.controller.user;

import com.haeseong.receipt_app.domain.User;
import com.haeseong.receipt_app.dto.user.LoginRequest;
import com.haeseong.receipt_app.dto.user.LoginResponse;
import com.haeseong.receipt_app.service.user.LoginService;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class LoginController {

    private final LoginService loginService;
    private static final String LOGIN_USER = "LOGIN_USER";

    public LoginController(LoginService loginService){
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request, HttpSession session) {
        System.out.println("login()");

        User user = loginService.login(request);
        session.setAttribute(LOGIN_USER,user.getUserId());

        return new LoginResponse("SUCCESS",user.getUserName());
    }

    @PostMapping("/logout")
    public void logout(HttpSession session){
        session.invalidate();
    }

    @GetMapping("/session-check")
    public String sessionCheck(HttpSession session){
        Object user=session.getAttribute(LOGIN_USER);
        if(user==null){
            throw new RuntimeException("unauthorized");
        }
        return "OK";
    }


}