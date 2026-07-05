package iuh.fit.se.todolistbackend.dto.request;

import iuh.fit.se.todolistbackend.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {
    @NotBlank(message = "Title must not be blank")
    String title;

    String description;

    @NotNull(message = "Priority must not be null")
    Priority priority;

    LocalDate dueDate;

    Boolean completed;
}
