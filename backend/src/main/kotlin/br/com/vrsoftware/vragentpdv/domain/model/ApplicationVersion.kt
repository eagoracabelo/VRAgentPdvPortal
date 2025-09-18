package br.com.vrsoftware.vragentpdv.domain.model


import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.data.annotation.Id
import java.time.LocalDateTime

@Entity
@Table(name = "application_versions")
data class ApplicationVersion(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true)
    val version: String,

    val description: String,

    val fileName: String,

    val fileHash: String,

    val filePath: String,

    @Enumerated(EnumType.STRING)
    val status: VersionStatus = VersionStatus.UPLOADED,

    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class VersionStatus {
    UPLOADED, DEPLOYING, DEPLOYED, FAILED
}