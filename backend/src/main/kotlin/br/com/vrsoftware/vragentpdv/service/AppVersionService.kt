package br.com.vrsoftware.vragentpdv.service

import br.com.vrsoftware.vragentpdv.model.dto.appversion.AppVersionInfo
import br.com.vrsoftware.vragentpdv.model.dto.appversion.AppVersionListDto
import br.com.vrsoftware.vragentpdv.model.dto.appversion.AppVersionResultDto
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.security.MessageDigest
import java.time.LocalDateTime
import java.util.Base64

@Service
class AppVersionService(
    private val saltApiService: SaltApiService,
    @Value("\${app.salt.files-path:/srv/salt/vrpdv/files}")
    private val saltFilesPath: String,
    @Value("\${app.salt.pillar-path:/srv/pillar}")
    private val pillarPath: String
) {
    private val logger = LoggerFactory.getLogger(AppVersionService::class.java)

    fun uploadAndPrepareVersion(
        file: MultipartFile,
        version: String,
        description: String?,
        targetMinions: String,
        autoApply: Boolean
    ): AppVersionResultDto {
        return try {
            // 1. Valida o arquivo
            if (file.isEmpty || file.originalFilename?.endsWith(".jar") != true) {
                return AppVersionResultDto(
                    success = false,
                    version = version,
                    message = "Arquivo deve ser um JAR válido"
                )
            }

            // 2. Calcula o hash do arquivo
            val fileHash = calculateFileHash(file.bytes)
            logger.info("Hash calculado para versão $version: $fileHash")

            // 3. Salva o arquivo no servidor Salt Master
            val saved = saveFileToSaltMaster(file, version, fileHash)
            if (!saved) {
                return AppVersionResultDto(
                    success = false,
                    version = version,
                    message = "Erro ao salvar arquivo no Salt Master"
                )
            }

            // 4. Atualiza o Pillar com a nova versão
            val pillarUpdated = updatePillarVersion(version)
            if (!pillarUpdated) {
                return AppVersionResultDto(
                    success = false,
                    version = version,
                    message = "Erro ao atualizar Pillar"
                )
            }

            // 5. Salva metadados da versão
            saveVersionMetadata(version, fileHash, description)

            // 6. Se autoApply for true, executa o deployment imediatamente
            val deploymentResult = if (autoApply) {
                deployVersion(version, targetMinions)
            } else null

            AppVersionResultDto(
                success = true,
                version = version,
                message = "Versão $version preparada com sucesso" +
                        if (autoApply) " e aplicada nos minions" else "",
                hash = fileHash,
                deploymentResult = deploymentResult?.let {
                    mapOf("deployment" to it)
                }
            )

        } catch (e: Exception) {
            logger.error("Erro ao preparar versão $version", e)
            AppVersionResultDto(
                success = false,
                version = version,
                message = "Erro interno: ${e.message}"
            )
        }
    }

    fun deployVersion(version: String, targetMinions: String): AppVersionResultDto {
        return try {
            // 1. Verifica se a versão existe
            if (!versionExists(version)) {
                return AppVersionResultDto(
                    success = false,
                    version = version,
                    message = "Versão $version não encontrada"
                )
            }

            // 2. Atualiza o Pillar para a versão alvo
            updatePillarVersion(version)

            // 3. Refresh pillar nos minions
            val refreshResult = saltApiService.executeCommand("salt", targetMinions, "saltutil.refresh_pillar")
            logger.info("Pillar refresh result: $refreshResult")

            // 4. Aplica o estado pdv_app
            val applyResult = saltApiService.executeCommand("salt", targetMinions, "state.apply pdv_app")

            AppVersionResultDto(
                success = true,
                version = version,
                message = "Deploy da versão $version executado com sucesso",
                deploymentResult = saltApiService.parseGenericResult(applyResult)
            )

        } catch (e: Exception) {
            logger.error("Erro no deploy da versão $version", e)
            AppVersionResultDto(
                success = false,
                version = version,
                message = "Erro no deploy: ${e.message}"
            )
        }
    }

    fun rollbackToVersion(version: String, targetMinions: String): AppVersionResultDto {
        return deployVersion(version, targetMinions) // Mesmo processo do deploy
    }

    private fun calculateFileHash(fileBytes: ByteArray): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hash = digest.digest(fileBytes)
        return hash.joinToString("") { "%02x".format(it) }
    }

    private fun saveFileToSaltMaster(file: MultipartFile, version: String, hash: String): Boolean {
        return try {
            // Cria comando para salvar arquivo no Salt Master
            val fileName = "aplicacao.jar"
            val tempFile = "/tmp/${version}_${fileName}"

            // Codifica arquivo em base64 para transferir via Salt
            val base64Content = Base64.getEncoder().encodeToString(file.bytes)

            // Comando para decodificar e salvar arquivo
            val saveCommand = """
                echo '$base64Content' | base64 -d > $tempFile && 
                cp $tempFile $saltFilesPath/$fileName &&
                rm $tempFile
            """.trimIndent().replace("\n", " ")

            val result = saltApiService.executeCommand("salt-run", "cmd.run '$saveCommand'")
            logger.info("Arquivo salvo no Salt Master: $result")
            true

        } catch (e: Exception) {
            logger.error("Erro ao salvar arquivo no Salt Master", e)
            false
        }
    }

    private fun updatePillarVersion(version: String): Boolean {
        return try {
            val pillarContent = """
                # Arquivo gerado automaticamente
                # Data: ${LocalDateTime.now()}
                pdv_app:
                  version: $version
            """.trimIndent()

            // Comando para atualizar pillar
            val updateCommand = "echo '$pillarContent' > $pillarPath/pdv_app.sls"
            val result = saltApiService.executeCommand("salt-run", "cmd.run '$updateCommand'")

            logger.info("Pillar atualizado para versão $version: $result")
            true

        } catch (e: Exception) {
            logger.error("Erro ao atualizar Pillar", e)
            false
        }
    }

    private fun saveVersionMetadata(version: String, hash: String, description: String?) {
        try {
            val metadata = """
                {
                  "version": "$version",
                  "hash": "$hash", 
                  "description": "${description ?: ""}",
                  "uploadDate": "${LocalDateTime.now()}",
                  "uploadedBy": "sistema"
                }
            """.trimIndent()

            val metadataPath = "$saltFilesPath/versions/$version.json"
            val saveCommand = "mkdir -p $saltFilesPath/versions && echo '$metadata' > $metadataPath"

            saltApiService.executeCommand("salt-run", "cmd.run '$saveCommand'")
            logger.info("Metadados salvos para versão $version")

        } catch (e: Exception) {
            logger.error("Erro ao salvar metadados da versão $version", e)
        }
    }

    fun listAvailableVersions(): AppVersionListDto {
        return try {
            // Lista arquivos de metadados
            val listCommand = "ls $saltFilesPath/versions/*.json 2>/dev/null || echo 'no_versions'"
            val result = saltApiService.executeCommand("salt-run", "cmd.run '$listCommand'")

            val versions = when (result) {
                is String -> {
                    if (result.contains("no_versions")) {
                        emptyList()
                    } else {
                        result.split("\n")
                            .filter { it.endsWith(".json") }
                            .mapNotNull { parseVersionMetadata(it) }
                    }
                }

                else -> emptyList()
            }

            // Obtém versão atual do pillar
            val currentVersion = getCurrentVersionFromPillar()

            AppVersionListDto(
                currentVersion = currentVersion,
                availableVersions = versions.sortedByDescending { it.uploadDate }
            )

        } catch (e: Exception) {
            logger.error("Erro ao listar versões", e)
            AppVersionListDto(null, emptyList())
        }
    }

    private fun parseVersionMetadata(filePath: String): AppVersionInfo? {
        return try {
            val catCommand = "cat $filePath"
            val content = saltApiService.executeCommand("salt-run", "cmd.run '$catCommand'") as String

            // Parse simples do JSON (em produção, use uma biblioteca JSON)
            val version = content.substringAfter("\"version\": \"").substringBefore("\"")
            val hash = content.substringAfter("\"hash\": \"").substringBefore("\"")
            val description = content.substringAfter("\"description\": \"").substringBefore("\"")
            val uploadDate = content.substringAfter("\"uploadDate\": \"").substringBefore("\"")

            AppVersionInfo(version, hash, uploadDate, description.ifEmpty { null })

        } catch (e: Exception) {
            logger.error("Erro ao parsear metadados de $filePath", e)
            null
        }
    }

    private fun getCurrentVersionFromPillar(): String? {
        return try {
            val catCommand = "cat $pillarPath/pdv_app.sls | grep 'version:' | awk '{print $2}'"
            val result = saltApiService.executeCommand("salt-run", "cmd.run '$catCommand'")
            (result as? String)?.trim()
        } catch (e: Exception) {
            null
        }
    }

    fun getCurrentVersionFromMinions(targetMinions: String): Map<String, Any?> {
        return try {
            val result = saltApiService.executeCommand("salt", targetMinions, "pillar.get pdv_app:version")
            saltApiService.parseGenericResult(result)
        } catch (e: Exception) {
            mapOf("error" to "Erro ao obter versão dos minions: ${e.message}")
        }
    }

    private fun versionExists(version: String): Boolean {
        return try {
            val checkCommand = "test -f $saltFilesPath/versions/$version.json && echo 'exists' || echo 'not_exists'"
            val result = saltApiService.executeCommand("salt-run", "cmd.run '$checkCommand'")
            (result as? String)?.contains("exists") == true
        } catch (e: Exception) {
            false
        }
    }

    fun deleteVersion(version: String): AppVersionResultDto {
        return try {
            val deleteCommand = "rm -f $saltFilesPath/versions/$version.json"
            saltApiService.executeCommand("salt-run", "cmd.run '$deleteCommand'")

            AppVersionResultDto(
                success = true,
                version = version,
                message = "Versão $version removida com sucesso"
            )
        } catch (e: Exception) {
            AppVersionResultDto(
                success = false,
                version = version,
                message = "Erro ao remover versão: ${e.message}"
            )
        }
    }
}