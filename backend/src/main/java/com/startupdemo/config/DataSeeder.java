package com.startupdemo.config;

import com.startupdemo.entity.Product;
import com.startupdemo.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                System.out.println("Seeding database with initial products...");

                Product p1 = new Product("Minimalist Leather Backpack", "Accessories", 129.00, "img-1", "🎒");
                Product p2 = new Product("Wireless Noise-Cancelling Headphones", "Electronics", 249.00, "img-2", "🎧");
                Product p3 = new Product("Smart Fitness Watch", "Wearables", 199.00, "img-3", "⌚");
                Product p4 = new Product("Premium Ceramic Coffee Dripper", "Home Goods", 45.00, "img-4", "☕");
                Product p5 = new Product("Ergonomic Office Chair", "Furniture", 299.00, "img-1", "🪑");
                Product p6 = new Product("Mechanical Keyboard", "Electronics", 159.00, "img-2", "⌨️");

                productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6));
                System.out.println("Products seeded successfully.");
            }
        };
    }
}
