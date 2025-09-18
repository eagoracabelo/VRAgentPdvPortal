package br.com.vrsoftware.vragentpdv.config

import org.apache.hc.client5.http.impl.classic.HttpClients
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory
import org.apache.hc.core5.ssl.SSLContextBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.web.client.RestTemplate
import java.security.cert.X509Certificate

@Configuration
class RestTemplateConfig {


    @Bean
    fun restTemplate(): RestTemplate {
        val acceptingTrustStrategy = { _: Array<X509Certificate>, _: String -> true }

        val sslContext = SSLContextBuilder.create()
            .loadTrustMaterial(null, acceptingTrustStrategy)
            .build()

        val csf = SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE)

        val connectionManager = PoolingHttpClientConnectionManager()
        connectionManager.maxTotal = 100
        connectionManager.defaultMaxPerRoute = 20

        val httpClient = HttpClients.custom()
            .setConnectionManager(connectionManager)
            .setSSLSocketFactory(csf)
            .build()

        val requestFactory = HttpComponentsClientHttpRequestFactory()
        requestFactory.httpClient = httpClient
        requestFactory.setConnectTimeout(30000)
        requestFactory.setReadTimeout(30000)

        return RestTemplate(requestFactory)
    }
}