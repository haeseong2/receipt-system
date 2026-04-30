package com.haeseong.receipt_app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoginCheckInterceptor implements HandlerInterceptor {

    private static final String LOGIN_USER = "LOGIN_USER";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute(LOGIN_USER) == null) {
            response.setStatus(401);
            return false;
        }
        return true;
    }
}