package br.com.vrsoftware.vragentpdv.presentation.controller

import br.com.vrsoftware.vragentpdv.domain.service.SaltService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/minions")
class MinionController(
    private val saltService: SaltService
) {
    @GetMapping
    fun listMinions(): ResponseEntity<ApiResponse<Map<String, List<String>>>> {
        return try {
            val response = saltService.executeCommand("*", "test.ping", emptyList())
            val minions = response.results.map { it.key }.toList()
            val result = mapOf("minions" to minions)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to list minions"))
        }
    }

    @GetMapping("/{minionId}/info")
    fun getMinionInfo(@PathVariable minionId: String): ResponseEntity<ApiResponse<Map<String, Any>>> {
        return try {
            val grains = saltService.getGrains(minionId)
            ResponseEntity.ok(ApiResponse.success(grains))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to get minion info"))
        }
    }

    @GetMapping("/{minionId}/status")
    fun getMinionStatus(@PathVariable minionId: String): ResponseEntity<ApiResponse<Map<String, Any>>> {
        return try {
            val uptime = saltService.executeCommand(minionId, "status.uptime", emptyList())
            val loadAvg = saltService.executeCommand(minionId, "status.loadavg", emptyList())
            val diskUsage = saltService.executeCommand(minionId, "disk.usage", emptyList())

            val status = mapOf(
                "uptime" to (uptime.results[minionId]?.get("ret") ?: "Unknown"),
                "load_average" to (loadAvg.results[minionId]?.get("ret") ?: "Unknown"),
                "disk_usage" to (diskUsage.results[minionId]?.get("ret") ?: "Unknown")
            )

            ResponseEntity.ok(ApiResponse.success(status))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to get minion status"))
        }
    }

    @PostMapping("/{minionId}/command")
    fun executeCommand(
        @PathVariable minionId: String,
        @RequestBody command: CommandRequest
    ): ResponseEntity<ApiResponse<Map<String, Any>>> {
        return try {
            val args = command.args ?: emptyList()
            val response = saltService.executeCommand(minionId, command.function, args)
            ResponseEntity.ok(ApiResponse.success(response.results))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to execute command"))
        }
    }
}

data class CommandRequest(
    val function: String,
    val args: List<String>? = null
)