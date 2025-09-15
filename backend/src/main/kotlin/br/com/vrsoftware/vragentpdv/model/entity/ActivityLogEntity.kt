package br.com.vrsoftware.vragentpdv.model.entity

import br.com.vrsoftware.vragentpdv.model.ActivityLog
import com.vladmihalcea.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.Type
import java.time.Instant

@Entity
@Table(name = "activity_logs")
data class ActivityLogEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "SERIAL")
    val id: Long? = null,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Column(nullable = false)
    val action: String,

    @Column(nullable = false)
    val target: String,

    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val details: Map<String, Any>? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: ActivityLog.ActivityStatus,

    @Column(name = "error_message")
    val errorMessage: String? = null,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
) {
    fun toDomain(): ActivityLog {
        return ActivityLog(
            id = id,
            userId = userId,
            action = action,
            target = target,
            details = details,
            status = status,
            errorMessage = errorMessage,
            createdAt = createdAt
        )
    }

    companion object {
        fun fromDomain(activityLog: ActivityLog): ActivityLogEntity {
            return ActivityLogEntity(
                id = activityLog.id,
                userId = activityLog.userId,
                action = activityLog.action,
                target = activityLog.target,
                details = activityLog.details,
                status = activityLog.status,
                errorMessage = activityLog.errorMessage,
                createdAt = activityLog.createdAt
            )
        }
    }
}