package br.com.vrsoftware.vragentpdv.service

import br.com.vrsoftware.vragentpdv.model.ActivityLog
import br.com.vrsoftware.vragentpdv.repository.ActivityLogRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
@Transactional
class ActivityLogService(
    private val activityLogRepository: ActivityLogRepository
) {

    fun logActivity(activityLog: ActivityLog): ActivityLog {
        return activityLogRepository.save(activityLog)
    }

    fun logSuccess(userId: Long, action: String, target: String, details: Map<String, Any>? = null): ActivityLog {
        val log = ActivityLog.success(userId, action, target, details)
        return activityLogRepository.save(log)
    }

    fun logFailure(userId: Long, action: String, target: String, errorMessage: String, details: Map<String, Any>? = null): ActivityLog {
        val log = ActivityLog.failure(userId, action, target, errorMessage, details)
        return activityLogRepository.save(log)
    }

    @Transactional(readOnly = true)
    fun getUserActivityLogs(userId: Long, pageable: Pageable): Page<ActivityLog> {
        return activityLogRepository.findByUserId(userId, pageable)
    }

    @Transactional(readOnly = true)
    fun getActivityLogsByAction(action: String, pageable: Pageable): Page<ActivityLog> {
        return activityLogRepository.findByAction(action, pageable)
    }

    @Transactional(readOnly = true)
    fun getActivityLogsByTarget(target: String, pageable: Pageable): Page<ActivityLog> {
        return activityLogRepository.findByTarget(target, pageable)
    }

    @Transactional(readOnly = true)
    fun getActivityLogsByDateRange(startDate: Instant, endDate: Instant, pageable: Pageable): Page<ActivityLog> {
        return activityLogRepository.findByDateRange(startDate, endDate, pageable)
    }
}