package br.com.vrsoftware.vragentpdv.domain.model


import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Table
import org.hibernate.annotations.UpdateTimestamp
import org.springframework.data.annotation.Id
import java.time.LocalDateTime

@Entity
@Table(name = "host_properties")
data class HostProperties(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val minionId: String,

    val propertyKey: String,

    val propertyValue: String,

    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.now()
)