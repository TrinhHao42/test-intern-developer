package iuh.fit.se.todolistbackend.repository;

import iuh.fit.se.todolistbackend.entity.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountReponsitory extends JpaRepository<Account, UUID> {
    @EntityGraph(attributePaths = "user")
    Optional<Account> findAccountByUsername(String username);
}
