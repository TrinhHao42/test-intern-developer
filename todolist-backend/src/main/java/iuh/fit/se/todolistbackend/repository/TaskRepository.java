package iuh.fit.se.todolistbackend.repository;

import iuh.fit.se.todolistbackend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
 
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUserIdAndDeletedAtIsNull(UUID userId);
    Optional<Task> findByIdAndUserIdAndDeletedAtIsNull(UUID id, UUID userId);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.deletedAt IS NULL " +
           "AND (cast(:completed as boolean) IS NULL OR t.completed = :completed) " +
           "AND (cast(:dueDate as date) IS NULL OR t.dueDate = :dueDate) " +
           "AND (cast(:search as string) IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))")
    List<Task> findTasks(@Param("userId") UUID userId,
                         @Param("completed") Boolean completed,
                         @Param("dueDate") LocalDate dueDate,
                         @Param("search") String search);
}
