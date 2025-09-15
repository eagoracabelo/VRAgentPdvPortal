package br.com.vrsoftware.vragentpdv.util

import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class DebugWebFilter : WebFilter {

    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        println("=== REQUEST DEBUG ===")
        println("URL: ${exchange.request.uri}")
        println("Method: ${exchange.request.method}")
        println("Headers: ${exchange.request.headers.toSingleValueMap()}")

        return chain.filter(exchange)
            .doFinally {
                println("Response Status: ${exchange.response.statusCode}")
                println("=== END REQUEST ===")
            }
    }
}