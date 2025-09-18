package br.com.vrsoftware.vragentpdv.domain.service

import br.com.vrsoftware.vragentpdv.domain.model.ApplicationVersion
import br.com.vrsoftware.vragentpdv.domain.model.DeploymentLog
import br.com.vrsoftware.vragentpdv.domain.model.DeploymentStatus
import br.com.vrsoftware.vragentpdv.domain.model.VersionStatus
import br.com.vrsoftware.vragentpdv.domain.repository.ApplicationVersionRepository
import br.com.vrsoftware.vragentpdv.domain.repository.DeploymentLogRepository
import br.com.vrsoftware.vragentpdv.presentation.controller.DeploymentHistoryItem
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.DigestUtils
import org.springframework.web.multipart.MultipartFile
import java.time.format.DateTimeFormatter

@Service
@Transactional
class ApplicationManagementService(
    private val versionRepository: ApplicationVersionRepository,
    private val deploymentLogRepository: DeploymentLogRepository,
    private val saltService: SaltService,
    private val storageService: StorageService
) {

    fun getAllVersions(): List<ApplicationVersion> {
        return versionRepository.findAll()
    }

    fun uploadNewVersion(file: MultipartFile, version: String, description: String): ApplicationVersion {
        // Verificar se versão já existe
        if (versionRepository.existsByVersion(version)) {
            throw IllegalArgumentException("Version $version already exists")
        }

        // Calcular hash do arquivo
        val fileHash = DigestUtils.sha256Hex(file.inputStream)

        // Salvar arquivo no storage
        val filePath = storageService.saveFile(file, version)

        // Criar registro no banco
        val appVersion = ApplicationVersion(
            version = version,
            description = description,
            fileName = file.originalFilename ?: "application.jar",
            fileHash = fileHash,
            filePath = filePath
        )

        return versionRepository.save(appVersion)
    }

    fun deployVersion(minionId: String, version: String): DeploymentResult {
        val appVersion = versionRepository.findByVersion(version)
            ?: throw IllegalArgumentException("Version $version not found")

        try {
            // Log início do deployment
            logDeployment(minionId, appVersion.id, DeploymentStatus.STARTED, "Starting deployment")

            // Verificar versão atual no minion
            val currentHash = saltService.getFileHash(minionId, "/opt/desktop-app/application.jar")

            if (currentHash == appVersion.fileHash) {
                logDeployment(minionId, appVersion.id, DeploymentStatus.SUCCESS, "Version already deployed")
                return DeploymentResult(true, "Version $version is already deployed")
            }

            // Executar state de deployment
            val pillarData = mapOf(
                "app_version" to version,
                "app_file_path" to appVersion.filePath,
                "app_file_hash" to appVersion.fileHash
            )

            val result = saltService.executeState(minionId, "deploy-application", pillarData)

            if (result.success) {
                appVersion.copy(status = VersionStatus.DEPLOYED).let { versionRepository.save(it) }
                logDeployment(minionId, appVersion.id, DeploymentStatus.SUCCESS, "Deployment successful")
                return DeploymentResult(true, "Version $version deployed successfully")
            } else {
                logDeployment(minionId, appVersion.id, DeploymentStatus.FAILED, result.message)
                return DeploymentResult(false, "Deployment failed: ${result.message}")
            }

        } catch (ex: Exception) {
            logDeployment(minionId, appVersion.id, DeploymentStatus.FAILED, ex.message ?: "Unknown error")
            throw ex
        }
    }

    fun getCurrentVersion(minionId: String): String? {
        val grains = saltService.getGrains(minionId)
        return grains["current_app_version"] as? String
    }

    fun rollbackToPreviousVersion(minionId: String): DeploymentResult {
        // Obter a versão atual
        val currentVersion = getCurrentVersion(minionId)
            ?: throw IllegalArgumentException("No current version found for minion $minionId")

        // Obter histórico de deployments bem-sucedidos para este minion, ordenados por timestamp (mais recente primeiro)
        val logs = deploymentLogRepository.findByMinionId(minionId)
            .filter { it.status == DeploymentStatus.SUCCESS }
            .sortedByDescending { it.timestamp }

        // Precisamos de pelo menos 2 deployments bem-sucedidos para fazer rollback
        if (logs.size < 2) {
            throw IllegalArgumentException("Not enough deployment history to perform rollback")
        }

        // A versão para rollback é a segunda mais recente no histórico
        val previousVersionId = logs[1].versionId
        val previousVersion = versionRepository.findById(previousVersionId)
            .orElseThrow { IllegalArgumentException("Previous version not found") }

        // Executar o deploy da versão anterior
        return deployVersion(minionId, previousVersion.version)
    }

    fun getDeploymentHistory(minionId: String): List<DeploymentHistoryItem> {
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

        return deploymentLogRepository.findByMinionId(minionId)
            .sortedByDescending { it.timestamp }
            .map { log ->
                val version = versionRepository.findById(log.versionId)
                    .map { it.version }
                    .orElse("Unknown")

                DeploymentHistoryItem(
                    version = version,
                    timestamp = log.timestamp.format(formatter),
                    status = log.status.toString(),
                    message = log.message
                )
            }
    }

    private fun logDeployment(minionId: String, versionId: Long, status: DeploymentStatus, message: String) {
        val log = DeploymentLog(
            minionId = minionId,
            versionId = versionId,
            status = status,
            message = message
        )
        deploymentLogRepository.save(log)
    }
}

data class DeploymentResult(
    val success: Boolean,
    val message: String
)