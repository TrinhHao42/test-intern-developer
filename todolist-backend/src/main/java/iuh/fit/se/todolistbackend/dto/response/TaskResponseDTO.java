package iuh.fit.se.todolistbackend.dto.response;

import iuh.fit.se.todolistbackend.entity.enums.Priority;
import iuh.fit.se.todolistbackend.entity.Task;
import lombok.*;
import lombok.experimental.FieldDefaults;
 
import java.time.LocalDate;
import java.util.UUID;
 
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponseDTO {
    UUID id;
    String title;
    String description;
    Priority priority;
    LocalDate dueDate;
    Boolean completed;

    public static TaskResponseDTO from(Task task) {
        if (task == null) {
            return null;
        }
        return TaskResponseDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .completed(task.getCompleted())
                .build();
    }
}
