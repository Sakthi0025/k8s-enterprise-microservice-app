package com.startupdemo.order.controller;

import com.startupdemo.order.entity.CartItem;
import com.startupdemo.order.entity.Product;
import com.startupdemo.order.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private EntityManager entityManager;

    @GetMapping("/cart")
    public List<CartItem> getCart(@RequestParam(defaultValue = "default") String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }

    @PostMapping("/cart")
    @Transactional
    public ResponseEntity<?> addToCart(
            @RequestParam(defaultValue = "default") String sessionId,
            @RequestBody Map<String, Long> payload) {

        Long productId = payload.get("productId");
        if (productId == null)
            return ResponseEntity.badRequest().body("productId is required");

        Product product = entityManager.find(Product.class, productId);
        if (product == null)
            return ResponseEntity.badRequest().body("Product not found");

        Optional<CartItem> existingItemOpt = cartItemRepository.findBySessionIdAndProductId(sessionId, productId);

        if (existingItemOpt.isPresent()) {
            CartItem item = existingItemOpt.get();
            item.setQuantity(item.getQuantity() + 1);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(product, 1);
            newItem.setSessionId(sessionId);
            cartItemRepository.save(newItem);
        }

        return ResponseEntity.ok(Map.of("message", "Item added to cart"));
    }

    @DeleteMapping("/cart/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long itemId) {
        if (cartItemRepository.existsById(itemId)) {
            cartItemRepository.deleteById(itemId);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        }
        return ResponseEntity.badRequest().body("Cart item not found");
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@RequestParam(defaultValue = "default") String sessionId) {
        List<CartItem> items = cartItemRepository.findBySessionId(sessionId);
        if (items.isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        double total = items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // In a real microservice, we would REST-call the payment-service here.
        // For the PoC, we delete the cart items marking checkout as "complete".
        cartItemRepository.deleteBySessionId(sessionId);

        return ResponseEntity.ok(Map.of(
                "message", "Order placed successfully!",
                "orderId", "ORD-" + System.currentTimeMillis(),
                "totalPaid", total));
    }
}
