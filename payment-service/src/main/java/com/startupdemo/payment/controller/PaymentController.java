package com.startupdemo.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentPayload) {
        // In a real scenario, this is where Stripe or PayPal gateway integration lives.

        System.out.println("Processing payment abstractly for Order: " + paymentPayload.get("orderId"));

        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "transactionId", UUID.randomUUID().toString(),
                "message", "Payment processed successfully!"));
    }
}
