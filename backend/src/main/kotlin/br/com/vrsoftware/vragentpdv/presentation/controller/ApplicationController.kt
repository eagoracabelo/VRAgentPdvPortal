package br.com.vrsoftware.vragentpdv.presentation.controller

import br.com.vrsoftware.vragentpdv.domain.model.ApplicationVersion
import br.com.vrsoftware.vragentpdv.domain.service.ApplicationManagementService
import br.com.vrsoftware.vragentpdv.domain.service.DeploymentResult
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import jakarta.validation.Valid
import jakarta.validation.constraints.Pattern

@RestController
@RequestMapping("/api/v1/applications")
@Validated
class ApplicationController(
    private val applicationService: ApplicationManagementService
) {
    @GetMapping("/versions")
    fun getAllVersions(): ResponseEntity<ApiResponse<List<ApplicationVersion>>> {
        return try {
            val versions = applicationService.getAllVersions()
            ResponseEntity.ok(ApiResponse.success(versions))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.message ?: "Failed to retrieve versions"))
        }
    }

    @GetMapping("/{minionId}/current")
    fun getCurrentVersion(@PathVariable minionId: String): ResponseEntity<ApiResponse<String?>> {
        return try {
            val version = applicationService.getCurrentVersion(minionId)
            ResponseEntity.ok(ApiResponse.success(version))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.message ?: "Failed to get current version"))
        }
    }

    @PostMapping("/upload")
    fun uploadVersion(
        @RequestParam file: MultipartFile,
        @RequestParam @Valid @Pattern(regexp = "^[0-9]+\\.[0-9]+\\.[0-9]+(-[0-9]+)?$") version: String,
        @RequestParam description: String
    ): ResponseEntity<ApiResponse<ApplicationVersion>> {
        return try {
            val result = applicationService.uploadNewVersion(file, version, description)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Invalid request"))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.message ?: "Upload failed"))
        }
    }

    @PostMapping("/deploy")
    fun deployVersion(
        @RequestBody @Valid request: DeploymentRequest
    ): ResponseEntity<ApiResponse<DeploymentResult>> {
        return try {
            val result = applicationService.deployVersion(request.minionId, request.version)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Invalid request"))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.message ?: "Deployment failed"))
        }
    }

    @PostMapping("/rollback")
    fun rollbackVersion(
        @RequestBody @Valid request: RollbackRequest
    ): ResponseEntity<ApiResponse<DeploymentResult>> {
        return try {
            val result = applicationService.rollbackToPreviousVersion(request.minionId)
            ResponseEntity.ok(ApiResponse.success(result))
        } catch (ex: IllegalArgumentException) {
            ResponseEntity.badRequest().body(ApiResponse.error(ex.message ?: "Invalid request"))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.message ?: "Rollback failed"))
        }
    }

    @GetMapping("/{minionId}/history")
    fun getDeploymentHistory(
        @PathVariable minionId: String
    ): ResponseEntity<ApiResponse<List<DeploymentHistoryItem>>> {
        return try {
            val history = applicationService.getDeploymentHistory(minionId)
            ResponseEntity.ok(ApiResponse.success(history))
        } catch (ex: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.message ?: "Failed to retrieve deployment history"))
        }
    }
}

data class DeploymentRequest(
    val minionId: String,
    val version: String
)

data class RollbackRequest(
    val minionId: String
)

data class DeploymentHistoryItem(
    val version: String,
    val timestamp: String,
    val status: String,
    val message: String
)