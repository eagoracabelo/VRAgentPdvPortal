package br.com.vrsoftware.vragentpdv.model

import java.time.Instant

data class ActivityLog(
    val id: Long? = null,
    val userId: Long,
    val action: String,
    val target: String,
    val details: Map<String, Any>? = null,
    val status: ActivityStatus,
    val errorMessage: String? = null,
    val createdAt: Instant = Instant.now()
) {
    enum class ActivityStatus {
        SUCCESS, FAILURE
    }

    companion object {
        fun success(userId: Long, action: String, target: String, details: Map<String, Any>? = null): ActivityLog {
            return ActivityLog(
                userId = userId,
                action = action,
                target = target,
                details = details,
                status = ActivityStatus.SUCCESS
            )
        }

        fun failure(userId: Long, action: String, target: String, errorMessage: String, details: Map<String, Any>? = null): ActivityLog {
            return ActivityLog(
                userId = userId,
                action = action,
                target = target,
                details = details,
                status = ActivityStatus.FAILURE,
                errorMessage = errorMessage
            )
        }
    }
}