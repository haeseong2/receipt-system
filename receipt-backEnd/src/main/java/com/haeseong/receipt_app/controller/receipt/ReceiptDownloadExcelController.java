package com.haeseong.receipt_app.controller.receipt;

import com.haeseong.receipt_app.service.receipt.ReceiptExcelService;
import com.haeseong.receipt_app.service.utile.SessionUserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReceiptDownloadExcelController {

    private final ReceiptExcelService receiptExcelService;
    private final SessionUserService sessionUserService;

    @GetMapping("/excel")
    public ResponseEntity<InputStreamResource> downloadExcel(@RequestParam int year, HttpSession session) throws Exception {
        Long userId = sessionUserService.getLoginUser(session).getUserId();

        ByteArrayInputStream excelStream = receiptExcelService.createYearExcel(userId, year);
        InputStreamResource resource = new InputStreamResource(excelStream);

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"receipt_" + year + ".xlsx\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }
}