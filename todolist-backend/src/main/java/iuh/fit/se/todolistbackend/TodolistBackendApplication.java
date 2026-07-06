package iuh.fit.se.todolistbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TodolistBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodolistBackendApplication.class, args);
    }

}
