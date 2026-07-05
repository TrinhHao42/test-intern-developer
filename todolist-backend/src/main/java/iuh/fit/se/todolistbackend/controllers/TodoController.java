package iuh.fit.se.todolistbackend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Todolist")
public class TodoController {
    @GetMapping("/")
    public String getAllTodoListWithUser() {
        return "list nè";
    }
}
