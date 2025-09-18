package br.com.vrsoftware.vragentpdv.domain.model


import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.springframework.data.annotation.Id
import java.time.LocalDateTime

@Entity
@Table(name = "deployment_logs")
data class DeploymentLog(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val minionId: String,

    val versionId: Long,

    @Enumerated(EnumType.STRING)
    val status: DeploymentStatus,

    val message: String,

    @CreationTimestamp
    val timestamp: LocalDateTime = LocalDateTime.now()
)

enum class DeploymentStatus {
    STARTED, SUCCESS, FAILED, ROLLBACK
}