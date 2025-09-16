package br.com.vrsoftware.vragentpdv.service

import br.com.vrsoftware.vragentpdv.config.SaltApiConfig
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import java.util.concurrent.ConcurrentHashMap
import kotlin.collections.set
import kotlin.text.get

@Service
class SaltService(
    private val webClient: WebClient,
    private val activityLogService: ActivityLogService,
    private val saltApiConfig: SaltApiConfig
) {

    private val saltApiProperties = saltApiConfig.saltApiProperties()
    private val tokenCache = ConcurrentHashMap<String, String>()

    fun login(): Mono<String> {

        if (tokenCache.containsKey("current")) {
            return Mono.just(tokenCache["current"]!!)
        }

        val loginRequest = mapOf(
            "username" to saltApiProperties.username,
            "password" to saltApiProperties.password,
            "eauth" to saltApiProperties.eauth
        )

        return webClient.post()
            .uri("${saltApiProperties.url}/login")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(loginRequest)
            .retrieve()
            .bodyToMono(Map::class.java)
            .map { response ->
                val returnData = response["return"] as List<*>
                val authData = returnData.firstOrNull() as? Map<*, *> ?: throw RuntimeException("Falha na autenticação com Salt API")

                val authToken = authData["token"] as String
                tokenCache["current"] = authToken
                authToken
            }
    }

    fun listKeys(userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                    {
                      "client": "wheel",
                      "fun": "key.list_all"
                    }
                """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->

                        val returnList = response["return"] as? List<*> ?: emptyList<Any>()
                        val firstReturn = returnList.firstOrNull() as? Map<*, *> ?: emptyMap<Any, Any>()
                        val data = firstReturn["data"] as? Map<*, *> ?: emptyMap<Any, Any>()
                        val saltReturn = data["return"] as? Map<*, *> ?: emptyMap<Any, Any>()

                        mapOf(
                            "minions" to (saltReturn["minions"] ?: emptyList<String>()),
                            "minions_pre" to (saltReturn["minions_pre"] ?: emptyList<String>()),
                            "minions_rejected" to (saltReturn["minions_rejected"] ?: emptyList<String>()),
                            "minions_denied" to (saltReturn["minions_denied"] ?: emptyList<String>())
                        )

                    }
                    .doOnSuccess { result ->
                        val resultMap = result as Map<*, *>
                        val totalMinions = (resultMap["minions"] as List<*>).size +
                                (resultMap["minions_pre"] as List<*>).size +
                                (resultMap["minions_rejected"] as List<*>).size +
                                (resultMap["minions_denied"] as List<*>).size

                        activityLogService.logSuccess(
                            userId = userId,
                            action = "LIST_KEYS",
                            target = "salt_api",
                            details = mapOf(
                                "minions_count" to (resultMap["minions"] as List<*>).size,
                                "minions_pre_count" to (resultMap["minions_pre"] as List<*>).size,
                                "minions_rejected_count" to (resultMap["minions_rejected"] as List<*>).size,
                                "minions_denied_count" to (resultMap["minions_denied"] as List<*>).size,
                                "total_keys" to totalMinions
                            )
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "LIST_KEYS",
                            target = "salt_api",
                            errorMessage = error.message ?: "Erro desconhecido"
                        )
                    }
            }
    }


    fun acceptKey(keyId: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "wheel",
                          "fun": "key.accept",
                          "match": "$keyId"
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val result = response["return"] as? Map<String, Any> ?: emptyMap()
                        result as Any
                    }
                    .doOnSuccess { result ->
                        activityLogService.logSuccess(
                            userId = userId,
                            action = "ACCEPT_KEY",
                            target = keyId,
                            details = mapOf(
                                "success" to true,
                                "timestamp" to System.currentTimeMillis()
                            )
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "ACCEPT_KEY",
                            target = keyId,
                            errorMessage = error.message ?: "Erro ao aceitar chave"
                        )
                    }
            }
    }

    fun rejectKey(keyId: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "wheel",
                          "fun": "key.reject",
                          "match": "$keyId"
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val result = response["return"] as? Map<String, Any> ?: emptyMap()
                        result as Any
                    }
                    .doOnSuccess { result ->
                        activityLogService.logSuccess(
                            userId = userId,
                            action = "REJECT_KEY",
                            target = keyId,
                            details = mapOf(
                                "success" to true,
                                "timestamp" to System.currentTimeMillis()
                            )
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "REJECT_KEY",
                            target = keyId,
                            errorMessage = error.message ?: "Erro ao rejeitar chave"
                        )
                    }
            }
    }

    fun denyKey(keyId: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "wheel",
                          "fun": "key.delete",
                          "match": "$keyId"
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val result = response["return"] as? Map<String, Any> ?: emptyMap()
                        result as Any
                    }
                    .doOnSuccess { result ->
                        activityLogService.logSuccess(
                            userId = userId,
                            action = "DENY_KEY",
                            target = keyId,
                            details = mapOf(
                                "success" to true,
                                "timestamp" to System.currentTimeMillis()
                            )
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "DENY_KEY",
                            target = keyId,
                            errorMessage = error.message ?: "Erro ao negar chave"
                        )
                    }
            }
    }

    fun executeCommand(target: String, command: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "local",
                          "tgt": "$target",
                          "fun": "cmd.run",
                          "arg": ["$command"]
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val result = response["return"] as? Map<String, Any> ?: emptyMap()
                        result as Any
                    }
                    .doOnSuccess { result ->

                        val resultMap = result as Map<*, *>
                        val commandResult = resultMap[target] as? String ?: "No output"

                        activityLogService.logSuccess(
                            userId = userId,
                            action = "EXECUTE_COMMAND",
                            target = target,
                            details = mapOf(
                                "command" to command,
                                "exit_code" to if (commandResult.contains("ERROR")) "1" else "0",
                                "output_length" to commandResult.length,
                                "has_error" to commandResult.contains("ERROR")
                            )
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "EXECUTE_COMMAND",
                            target = target,
                            errorMessage = error.message ?: "Erro ao executar comando",
                            details = mapOf("command" to command)
                        )
                    }
            }
    }

    fun updateVRAgentePdv(minionId: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "local",
                          "tgt": "$minionId",
                          "fun": "state.apply",
                          "arg": ["vragente-pdv.update"]
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val result = response["return"] as? Map<String, Any> ?: emptyMap()
                        result as Any
                    }
                    .doOnSuccess { result ->
                        activityLogService.logSuccess(
                            userId = userId,
                            action = "UPDATE_VRAGENTE_PDV",
                            target = minionId,
                            details = mapOf("result" to result)
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "UPDATE_VRAGENTE_PDV",
                            target = minionId,
                            errorMessage = error.message ?: "Erro ao atualizar VRAgente PDV"
                        )
                    }
            }
    }

    fun manageFile(minionId: String, sourcePath: String, destinationPath: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "local",
                          "tgt": "$minionId",
                          "fun": "file.managed",
                          "arg": ["$destinationPath", "source=$sourcePath"]
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val result = response["return"] as? Map<String, Any> ?: emptyMap()
                        result as Any
                    }
                    .doOnSuccess { result ->
                        activityLogService.logSuccess(
                            userId = userId,
                            action = "MANAGE_FILE",
                            target = minionId,
                            details = mapOf(
                                "source" to sourcePath,
                                "destination" to destinationPath,
                                "result" to result
                            )
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "MANAGE_FILE",
                            target = minionId,
                            errorMessage = error.message ?: "Erro ao gerenciar arquivo",
                            details = mapOf(
                                "source" to sourcePath,
                                "destination" to destinationPath
                            )
                        )
                    }
            }
    }

    fun getMinionInfo(minionId: String, userId: Long): Mono<Any> {
        return login()
            .flatMap { token ->
                webClient.post()
                    .uri("${saltApiProperties.url}/")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header("X-Auth-Token", token)
                    .bodyValue(
                        """
                        {
                          "client": "local",
                          "tgt": "$minionId",
                          "fun": "grains.items"
                        }
                    """.trimIndent()
                    )
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .map { response ->
                        val returnList = response["return"] as? List<*> ?: emptyList<Any>()
                        val minionData = returnList.firstOrNull() as? Map<*, *> ?: emptyMap<Any, Any>()
                        val grains = minionData[minionId] as? Map<*, *> ?: emptyMap<Any, Any>()
                        
                        mapOf(
                            "id" to minionId,
                            "os" to (grains["os"] ?: "unknown"),
                            "os_family" to (grains["osfamily"] ?: "unknown"),
                            "osrelease" to (grains["osrelease"] ?: "unknown"),
                            "oscodename" to (grains["oscodename"] ?: "unknown"),
                            "kernel" to (grains["kernel"] ?: "unknown"),
                            "kernelrelease" to (grains["kernelrelease"] ?: "unknown"),
                            "cpu_model" to (grains["cpu_model"] ?: "unknown"),
                            "cpuarch" to (grains["cpuarch"] ?: "unknown"),
                            "num_cpus" to (grains["num_cpus"] ?: 0),
                            "mem_total" to (grains["mem_total"] ?: 0),
                            "ip4_interfaces" to (grains["ip4_interfaces"] ?: emptyMap<String, Any>()),
                            "fqdn" to (grains["fqdn"] ?: "unknown"),
                            "host" to (grains["host"] ?: "unknown"),
                            "saltversion" to (grains["saltversion"] ?: "unknown"),
                            "pythonversion" to (grains["pythonversion"] ?: emptyList<Any>())
                        ) as Any
                    }
                    .doOnSuccess { result ->
                        activityLogService.logSuccess(
                            userId = userId,
                            action = "GET_MINION_INFO",
                            target = minionId,
                            details = mapOf("success" to true)
                        )
                    }
                    .doOnError { error ->
                        activityLogService.logFailure(
                            userId = userId,
                            action = "GET_MINION_INFO",
                            target = minionId,
                            errorMessage = error.message ?: "Erro ao obter informações do minion"
                        )
                    }
            }
    }

}