package iuh.fit.se.todolistbackend.dto.response;

import iuh.fit.se.todolistbackend.entity.enums.Priority;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskResponseDTO {
    String title;
    String description;
    Priority priority;
    LocalDate dueDate;
    Boolean completed;
}
