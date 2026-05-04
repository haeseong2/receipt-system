package com.haeseong.receipt_app.controller.receipt;

import com.haeseong.receipt_app.dto.receiptMain.ReceiptDashboardResponse;
import com.haeseong.receipt_app.service.receipt.ReceiptDashboardService;
import com.haeseong.receipt_app.service.utile.SessionUserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReceiptDashboardController {

    private final ReceiptDashboardService dashboardService;
    private final SessionUserService sessionUserService;

    @GetMapping("/dashboard")
    public ReceiptDashboardResponse getDashboard(HttpSession session) {
        System.out.println("dashboard()");

        Long userId = sessionUserService.getLoginUser(session).getUserId();
        return dashboardService.getDashboard(userId);
    }
}