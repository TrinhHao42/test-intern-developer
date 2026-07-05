package iuh.fit.se.todolistbackend.dto.response;

import iuh.fit.se.todolistbackend.entity.Account;

import java.util.UUID;

public record AuthResponseDTO(String name) {

    public static AuthResponseDTO from(Account account) {
        return new AuthResponseDTO(
                account.getUser().getName()
        );
    }
}