package br.com.vrsoftware.vragentpdv.repository

import br.com.vrsoftware.vragentpdv.model.ActivityLog
import br.com.vrsoftware.vragentpdv.model.entity.ActivityLogEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class ActivityLogRepositoryImpl(
    private val jpaRepository: ActivityLogJpaRepository
) : ActivityLogRepository {

    override fun save(activityLog: ActivityLog): ActivityLog {
        val entity = ActivityLogEntity.fromDomain(activityLog)
        val savedEntity = jpaRepository.save(entity)
        return savedEntity.toDomain()
    }

    override fun findByUserId(userId: Long, pageable: Pageable): Page<ActivityLog> {
        return jpaRepository.findByUserId(userId, pageable)
            .map { it.toDomain() }
    }

    override fun findByAction(action: String, pageable: Pageable): Page<ActivityLog> {
        return jpaRepository.findByAction(action, pageable)
            .map { it.toDomain() }
    }

    override fun findByUserIdAndAction(userId: Long, action: String, pageable: Pageable): Page<ActivityLog> {
        return jpaRepository.findByUserIdAndAction(userId, action, pageable)
            .map { it.toDomain() }
    }

    override fun findByTarget(target: String, pageable: Pageable): Page<ActivityLog> {
        return jpaRepository.findByTarget(target, pageable)
            .map { it.toDomain() }
    }

    override fun findByDateRange(startDate: Instant, endDate: Instant, pageable: Pageable): Page<ActivityLog> {
        return jpaRepository.findByCreatedAtBetween(startDate, endDate, pageable)
            .map { it.toDomain() }
    }
}