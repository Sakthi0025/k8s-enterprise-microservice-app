package com.startupdemo.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public Map<String, Object> getUsers() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User Service responding");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("users", List.of(
                Map.of("id", 1, "name", "Alice (Premium)"),
                Map.of("id", 2, "name", "Bob (Standard)"),
                Map.of("id", 3, "name", "Charlie (Enterprise)")));
        return response;
    }
}
