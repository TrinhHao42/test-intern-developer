package iuh.fit.se.todolistbackend.controllers;

import iuh.fit.se.todolistbackend.dto.common.ApiResponse;
import iuh.fit.se.todolistbackend.dto.request.TaskRequestDTO;
import iuh.fit.se.todolistbackend.dto.response.TaskResponseDTO;
import iuh.fit.se.todolistbackend.entity.enums.Priority;
import iuh.fit.se.todolistbackend.services.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/Todolist", "/Todolist/"})
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasks(
            @RequestParam(value = "completed", required = false) Boolean completed,
            @RequestParam(value = "dueDate", required = false) LocalDate dueDate,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "priority", required = false) Priority priority) {
        List<TaskResponseDTO> tasks = taskService.getTasks(completed, dueDate, search, priority);
        ApiResponse<List<TaskResponseDTO>> response = ApiResponse.<List<TaskResponseDTO>>builder()
                .code(HttpStatus.OK.value())
                .message("Get tasks successfully")
                .result(tasks)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(@Valid @RequestBody TaskRequestDTO request) {
        TaskResponseDTO task = taskService.createTask(request);
        ApiResponse<TaskResponseDTO> response = ApiResponse.<TaskResponseDTO>builder()
                .code(HttpStatus.CREATED.value())
                .message("Create task successfully")
                .result(task)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(@PathVariable("id") UUID id,
                                                                   @Valid @RequestBody TaskRequestDTO request) {
        TaskResponseDTO task = taskService.updateTask(id, request);
        ApiResponse<TaskResponseDTO> response = ApiResponse.<TaskResponseDTO>builder()
                .code(HttpStatus.OK.value())
                .message("Update task successfully")
                .result(task)
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable("id") UUID id) {
        taskService.deleteTask(id);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Delete task successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
