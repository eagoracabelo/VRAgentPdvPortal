package br.com.vrsoftware.vragentpdv

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
@ComponentScan(basePackages = ["br.com.vrsoftware.vragentpdv"])
class VrAgentPdvApplication

fun main(args: Array<String>) {
	runApplication<VrAgentPdvApplication>(*args)
}