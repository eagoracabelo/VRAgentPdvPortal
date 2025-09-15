package br.com.vrsoftware.vragentpdv.repository

import br.com.vrsoftware.vragentpdv.model.ActivityLog
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import java.time.Instant

interface ActivityLogRepository {
    fun save(activityLog: ActivityLog): ActivityLog
    fun findByUserId(userId: Long, pageable: Pageable): Page<ActivityLog>
    fun findByAction(action: String, pageable: Pageable): Page<ActivityLog>
    fun findByUserIdAndAction(userId: Long, action: String, pageable: Pageable): Page<ActivityLog>
    fun findByTarget(target: String, pageable: Pageable): Page<ActivityLog>
    fun findByDateRange(startDate: Instant, endDate: Instant, pageable: Pageable): Page<ActivityLog>
}