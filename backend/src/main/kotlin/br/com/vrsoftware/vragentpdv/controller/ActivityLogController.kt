package br.com.vrsoftware.vragentpdv.controller

import br.com.vrsoftware.vragentpdv.model.ActivityLog
import br.com.vrsoftware.vragentpdv.service.ActivityLogService
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.Instant

@RestController
@RequestMapping("/api/activity-logs")
class ActivityLogController(
    private val activityLogService: ActivityLogService
) {

    @GetMapping("/user/{userId}")
    fun getUserLogs(
        @PathVariable userId: Long,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<ActivityLog>> {
        val logs = activityLogService.getUserActivityLogs(userId, pageable)
        return ResponseEntity.ok(logs)
    }

    @GetMapping("/action/{action}")
    fun getLogsByAction(
        @PathVariable action: String,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<ActivityLog>> {
        val logs = activityLogService.getActivityLogsByAction(action, pageable)
        return ResponseEntity.ok(logs)
    }

    @GetMapping("/target/{target}")
    fun getLogsByTarget(
        @PathVariable target: String,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<ActivityLog>> {
        val logs = activityLogService.getActivityLogsByTarget(target, pageable)
        return ResponseEntity.ok(logs)
    }

    @GetMapping("/date-range")
    fun getLogsByDateRange(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) startDate: Instant,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) endDate: Instant,
        @PageableDefault(size = 20) pageable: Pageable
    ): ResponseEntity<Page<ActivityLog>> {
        val logs = activityLogService.getActivityLogsByDateRange(startDate, endDate, pageable)
        return ResponseEntity.ok(logs)
    }
}