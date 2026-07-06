package iuh.fit.se.todolistbackend.dto.request;

import iuh.fit.se.todolistbackend.entity.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

import jakarta.validation.constraints.Size;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequestDTO {
    @NotBlank(message = "Tiêu đề công việc không được để trống.")
    @Size(max = 255, message = "Tiêu đề không được vượt quá 255 ký tự.")
    String title;

    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự.")
    String description;

    @NotNull(message = "Độ ưu tiên không được để trống.")
    Priority priority;

    LocalDate dueDate;

    Boolean completed;
}
