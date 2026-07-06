package iuh.fit.se.todolistbackend.services;

import iuh.fit.se.todolistbackend.dto.request.TaskRequestDTO;
import iuh.fit.se.todolistbackend.dto.response.TaskResponseDTO;
import iuh.fit.se.todolistbackend.entity.Task;
import iuh.fit.se.todolistbackend.entity.User;
import iuh.fit.se.todolistbackend.entity.enums.Priority;
import iuh.fit.se.todolistbackend.exception.AppException;
import iuh.fit.se.todolistbackend.exception.ErrorCode;
import iuh.fit.se.todolistbackend.repository.TaskRepository;
import iuh.fit.se.todolistbackend.repository.UserRepository;
import iuh.fit.se.todolistbackend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.userId();
        }
        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getTasks(Boolean completed, java.time.LocalDate dueDate, String search, Priority priority) {
        UUID userId = getCurrentUserId();
        
        StringBuilder jpql = new StringBuilder("SELECT t FROM Task t WHERE t.user.id = :userId AND t.deletedAt IS NULL");
        
        if (completed != null) {
            jpql.append(" AND t.completed = :completed");
        }
        if (dueDate != null) {
            jpql.append(" AND t.dueDate = :dueDate");
        }
        if (priority != null) {
            jpql.append(" AND t.priority = :priority");
        }
        if (search != null && !search.trim().isEmpty()) {
            jpql.append(" AND (LOWER(t.title) LIKE LOWER(:search) OR LOWER(t.description) LIKE LOWER(:search))");
        }
        
        var query = entityManager.createQuery(jpql.toString(), Task.class);
        query.setParameter("userId", userId);
        
        if (completed != null) {
            query.setParameter("completed", completed);
        }
        if (dueDate != null) {
            query.setParameter("dueDate", dueDate);
        }
        if (priority != null) {
            query.setParameter("priority", priority);
        }
        if (search != null && !search.trim().isEmpty()) {
            query.setParameter("search", "%" + search.trim() + "%");
        }
        
        return query.getResultList().stream()
                .map(TaskResponseDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponseDTO createTask(TaskRequestDTO request) {
        UUID userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return TaskResponseDTO.from(savedTask);
    }

    @Transactional
    public TaskResponseDTO updateTask(UUID taskId, TaskRequestDTO request) {
        UUID userId = getCurrentUserId();
        Task task = taskRepository.findByIdAndUserIdAndDeletedAtIsNull(taskId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Task not found or unauthorized"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }
        task.setUpdatedAt(LocalDateTime.now());

        Task updatedTask = taskRepository.save(task);
        return TaskResponseDTO.from(updatedTask);
    }

    @Transactional
    public void deleteTask(UUID taskId) {
        UUID userId = getCurrentUserId();
        Task task = taskRepository.findByIdAndUserIdAndDeletedAtIsNull(taskId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST, "Task not found or unauthorized"));

        task.setDeletedAt(LocalDateTime.now());
        taskRepository.save(task);
    }
}
