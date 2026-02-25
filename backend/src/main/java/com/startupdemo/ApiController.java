package com.startupdemo;

import com.startupdemo.entity.CartItem;
import com.startupdemo.entity.Product;
import com.startupdemo.repository.CartItemRepository;
import com.startupdemo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ApiController {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    // --- HEALTH & STATUS ENDPOINTS ---

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Spring Boot Backend is running smoothly");
        return response;
    }

    @GetMapping("/users")
    public Map<String, Object> getUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            Object timestamp = entityManager.createNativeQuery("SELECT current_timestamp").getSingleResult();
            response.put("message", "Successfully connected to PostgreSQL");
            response.put("timestamp", timestamp.toString());
            // Kept for backward compatibility with the existing "Top Merchants" component
            response.put("users", List.of(
                    Map.of("id", 1, "name", "Alice"),
                    Map.of("id", 2, "name", "Bob")));
        } catch (Exception e) {
            response.put("error", "Database connection failed: " + e.getMessage());
        }
        return response;
    }

    // --- E-COMMERCE ENDPOINTS ---

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/cart")
    public List<CartItem> getCart(@RequestParam(defaultValue = "default") String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addToCart(
            @RequestParam(defaultValue = "default") String sessionId,
            @RequestBody Map<String, Long> payload) {

        Long productId = payload.get("productId");
        if (productId == null)
            return ResponseEntity.badRequest().body("productId is required");

        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        Product product = productOpt.get();
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

        // Clear the cart after "successful" payment
        cartItemRepository.deleteBySessionId(sessionId);

        return ResponseEntity.ok(Map.of(
                "message", "Order placed successfully!",
                "orderId", "ORD-" + System.currentTimeMillis(),
                "totalPaid", total));
    }
}
