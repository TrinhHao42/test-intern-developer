package iuh.fit.se.todolistbackend.entity;

import iuh.fit.se.todolistbackend.entity.enums.Priority;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "todos")
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Todo {
    @Id
    @Column(name = "todo_id")
    @GeneratedValue
    @UuidGenerator
    UUID id;

    String title;

    String description;

    @Enumerated(EnumType.STRING)
    Priority priority;

    @Column(name = "due_date")
    LocalDate dueDate;

    @Column(nullable = false, columnDefinition = "boolean default false")
    Boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @CreationTimestamp
    LocalDateTime updatedAt;

    @Column(name = "deleted_at", columnDefinition = "timestamp default null")
    LocalDateTime deletedAt;
}
