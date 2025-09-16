package br.com.vrsoftware.vragentpdv.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Duration

@Configuration
class SaltApiConfig {

    @Value("\${salt.api.url}")
    private lateinit var saltApiUrl: String

    @Value("\${salt.api.username}")
    private lateinit var username: String

    @Value("\${salt.api.password}")
    private lateinit var password: String

    @Value("\${salt.api.eauth:pam}")
    private var eauth: String = "pam"

    @Value("\${salt.api.timeout:30}")
    private val timeout: Long = 30

    @Bean
    fun saltApiProperties(): SaltApiProperties {
        return SaltApiProperties(
            url = saltApiUrl,
            username = username,
            password = password,
            eauth = eauth,
            timeout = Duration.ofSeconds(timeout)
        )
    }
}

data class SaltApiProperties(
    val url: String,
    val username: String,
    val password: String,
    val eauth: String,
    val timeout: Duration
)