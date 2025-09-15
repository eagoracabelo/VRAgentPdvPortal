package br.com.vrsoftware.vragentpdv.repository

import br.com.vrsoftware.vragentpdv.model.entity.ActivityLogEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
interface ActivityLogJpaRepository : JpaRepository<ActivityLogEntity, Long> {
    fun findByUserId(userId: Long, pageable: Pageable): Page<ActivityLogEntity>
    fun findByAction(action: String, pageable: Pageable): Page<ActivityLogEntity>
    fun findByUserIdAndAction(userId: Long, action: String, pageable: Pageable): Page<ActivityLogEntity>
    fun findByTarget(target: String, pageable: Pageable): Page<ActivityLogEntity>
    fun findByCreatedAtBetween(startDate: Instant, endDate: Instant, pageable: Pageable): Page<ActivityLogEntity>
}