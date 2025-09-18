package br.com.vrsoftware.vragentpdv.presentation.controller

import br.com.vrsoftware.vragentpdv.domain.service.PropertiesManagementService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid

@RestController
@RequestMapping("/api/v1/properties")
class PropertiesController(
    private val propertiesService: PropertiesManagementService
) {
    @GetMapping("/{minionId}")
    fun getProperties(@PathVariable minionId: String): ResponseEntity<ApiResponse<Map<String, String>>> {
        return try {
            val properties = propertiesService.getProperties(minionId)
            ResponseEntity.ok(ApiResponse.success(properties))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to get properties"))
        }
    }

    @PutMapping("/{minionId}")
    fun updateProperty(
        @PathVariable minionId: String,
        @RequestBody @Valid request: PropertyRequest
    ): ResponseEntity<ApiResponse<Boolean>> {
        return try {
            val result = propertiesService.updateProperty(minionId, request.key, request.value)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to update property"))
        }
    }

    @PostMapping("/{minionId}")
    fun addProperty(
        @PathVariable minionId: String,
        @RequestBody @Valid request: PropertyRequest
    ): ResponseEntity<ApiResponse<Boolean>> {
        return try {
            val result = propertiesService.addProperty(minionId, request.key, request.value)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Property already exists"))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to add property"))
        }
    }

    @DeleteMapping("/{minionId}/{key}")
    fun removeProperty(
        @PathVariable minionId: String,
        @PathVariable key: String
    ): ResponseEntity<ApiResponse<Boolean>> {
        return try {
            val result = propertiesService.removeProperty(minionId, key)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: Exception) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Failed to remove property"))
        }
    }
}

data class PropertyRequest(
    val key: String,
    val value: String
)