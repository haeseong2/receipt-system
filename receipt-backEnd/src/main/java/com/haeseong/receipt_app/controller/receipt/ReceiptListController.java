package com.haeseong.receipt_app.controller.receipt;

import com.haeseong.receipt_app.dto.receiptList.ReceiptListResponseDto;
import com.haeseong.receipt_app.service.receipt.ReceiptListService;
import com.haeseong.receipt_app.service.utile.SessionUserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReceiptListController {

    private final ReceiptListService receiptListService;
    private final SessionUserService sessionUserService;

    @GetMapping("/receiptList")
    public Page<ReceiptListResponseDto> getList(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam(required=false) String category,
            @RequestParam(required=false) String storeName,
            HttpSession session
    ){
        Long userId = sessionUserService.getLoginUser(session).getUserId();

        return receiptListService.getReceiptList(userId, page, size, year, month, category, storeName);
    }
}