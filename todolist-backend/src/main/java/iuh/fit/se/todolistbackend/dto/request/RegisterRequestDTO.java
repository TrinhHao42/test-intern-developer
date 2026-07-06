package iuh.fit.se.todolistbackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "Tên đăng nhập không được để trống.")
    @Size(min = 4, max = 50, message = "Tên đăng nhập phải từ 4 đến 50 ký tự.")
    String username;

    @NotBlank(message = "Mật khẩu không được để trống.")
    @Size(
            min = 8,
            message = "Mật khẩu phải có ít nhất 8 kí tự."
    )
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).+$",
            message = "Mật khẩu phải có ít nhất 1 kí tự in hoa, 1 kí tự in thường, 1 kí tự số và 1 kí tự đặc biệt."
    )
    String password;

    @NotBlank(message = "Tên hiển thị không được để trống.")
    @Size(min = 2, max = 100, message = "Tên hiển thị phải từ 2 đến 100 ký tự.")
    String name;
}
