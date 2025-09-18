package br.com.vrsoftware.vragentpdv.domain.service

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class SaltService(
    @Value("\${salt.api.url}") private val saltApiUrl: String,
    @Value("\${salt.api.username}") private val username: String,
    @Value("\${salt.api.password}") private val password: String,
    private val restTemplate: RestTemplate,
    private val objectMapper: ObjectMapper
) {

    private var authToken: String? = null

    @PostConstruct
    fun authenticate() {
        val authRequest = mapOf(
            "username" to username,
            "password" to password,
            "eauth" to "pam"
        )

        val response = restTemplate.postForEntity(
            "$saltApiUrl/login",
            authRequest,
            Map::class.java
        )

        authToken = response.body?.get("token") as? String
            ?: throw RuntimeException("Failed to authenticate with Salt API")
    }

    fun executeState(minionId: String, state: String, pillarData: Map<String, Any> = emptyMap()): SaltResponse {
        val headers = HttpHeaders().apply {
            set("X-Auth-Token", authToken)
            contentType = MediaType.APPLICATION_JSON
        }

        val request = mapOf(
            "client" to "local",
            "tgt" to minionId,
            "fun" to "state.apply",
            "arg" to listOf(state),
            "kwarg" to mapOf("pillar" to pillarData)
        )

        val response = restTemplate.exchange(
            "$saltApiUrl/",
            HttpMethod.POST,
            HttpEntity(request, headers),
            Map::class.java
        )

        return parseSaltResponse(response.body)
    }

    fun getFileHash(minionId: String, filePath: String): String? {
        return executeCommand(minionId, "file.get_hash", listOf(filePath))
            .results[minionId]?.get("ret") as? String
    }

    fun getGrains(minionId: String): Map<String, Any> {
        return executeCommand(minionId, "grains.items", emptyList())
            .results[minionId]?.get("ret") as? Map<String, Any> ?: emptyMap()
    }

    fun getProperties(minionId: String, propertiesPath: String): Map<String, String> {
        val result = executeCommand(minionId, "file.read", listOf(propertiesPath))
        val content = result.results[minionId]?.get("ret") as? String ?: return emptyMap()

        return content.lines()
            .filter { it.contains("=") && !it.trim().startsWith("#") }
            .associate {
                val parts = it.split("=", limit = 2)
                parts[0].trim() to parts.getOrElse(1) { "" }.trim()
            }
    }

    fun executeCommand(minionId: String, function: String, args: List<String>): SaltResponse {
        val headers = HttpHeaders().apply {
            set("X-Auth-Token", authToken)
            contentType = MediaType.APPLICATION_JSON
        }

        val request = mapOf(
            "client" to "local",
            "tgt" to minionId,
            "fun" to function,
            "arg" to args
        )

        val response = restTemplate.exchange(
            "$saltApiUrl/",
            HttpMethod.POST,
            HttpEntity(request, headers),
            Map::class.java
        )

        return parseSaltResponse(response.body)
    }

    private fun parseSaltResponse(body: Map<String, Any>?): SaltResponse {
        // Implementar parsing da resposta do Salt
        return SaltResponse(
            success = true,
            results = body?.get("return") as? Map<String, Map<String, Any>> ?: emptyMap()
        )
    }
}

data class SaltResponse(
    val success: Boolean,
    val results: Map<String, Map<String, Any>>,
    val message: String = ""
)