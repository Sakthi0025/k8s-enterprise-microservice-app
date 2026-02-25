package com.startupdemo.product.config;

import com.startupdemo.product.entity.Product;
import com.startupdemo.product.repository.ProductRepository;
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
                System.out.println("Seeding database with premium styling products...");

                Product p1 = new Product("Minimalist Leather Backpack", "Bags", 129.00,
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600");
                Product p2 = new Product("Wireless Noise-Cancelling Headphones", "Audio", 249.00,
                        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600");
                Product p3 = new Product("Smart Fitness Watch", "Wearables", 199.00,
                        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600");
                Product p4 = new Product("Premium Ceramic Coffee Dripper", "Lifestyle", 45.00,
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600");
                Product p5 = new Product("Performance Running Shoes", "Footwear", 159.00,
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600");
                Product p6 = new Product("Aluminum Mechanical Keyboard", "Tech", 189.00,
                        "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600");

                productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6));
                System.out.println("Products seeded successfully.");
            }
        };
    }
}
