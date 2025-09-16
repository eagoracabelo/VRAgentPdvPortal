package br.com.vrsoftware.vragentpdv.controller

import br.com.vrsoftware.vragentpdv.model.CommandRequest
import br.com.vrsoftware.vragentpdv.model.FileManagementRequest
import br.com.vrsoftware.vragentpdv.service.SaltService
import br.com.vrsoftware.vragentpdv.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api/minions")
class MinionsController(
    private val saltApiService: SaltService,
    private val userService: UserService
) {

    @GetMapping
    fun getAllMinions(): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.listKeys(userId)
            .map { keys ->
                ResponseEntity.ok(keys)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao obter a lista de chaves!")))
    }

    @PostMapping("/{keyId}/accept")
    fun acceptKey(@PathVariable keyId: String): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.acceptKey(keyId, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao aceitar chave")))
    }

    @PostMapping("/{keyId}/reject")
    fun rejectKey(@PathVariable keyId: String): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.rejectKey(keyId, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao rejeitar chave")))
    }

    @PostMapping("/{keyId}/deny")
    fun denyKey(@PathVariable keyId: String): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.denyKey(keyId, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao negar chave")))
    }

    @GetMapping("/{minionId}/info")
    fun getMinionInfo(@PathVariable minionId: String): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.getMinionInfo(minionId, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao obter informações do minion")))
    }

    @PostMapping("/{minionId}/command")
    fun executeCommand(
        @PathVariable minionId: String,
        @RequestBody commandRequest: CommandRequest
    ): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.executeCommand(minionId, commandRequest.command, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao executar comando")))
    }

    @PostMapping("/{minionId}/update")
    fun updateVRAgentePdv(@PathVariable minionId: String): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.updateVRAgentePdv(minionId, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao atualizar VRAgente PDV")))
    }

    @PostMapping("/{minionId}/file")
    fun manageFile(
        @PathVariable minionId: String,
        @RequestBody fileRequest: FileManagementRequest
    ): Mono<ResponseEntity<Any>> {
        val userId = getCurrentUserId()
        return saltApiService.manageFile(minionId, fileRequest.sourcePath, fileRequest.destinationPath, userId)
            .map { result ->
                ResponseEntity.ok(result)
            }
            .onErrorReturn(ResponseEntity.status(500).body(mapOf("error" to "Erro ao gerenciar arquivo")))
    }

    private fun getCurrentUserId(): Long {
        // TODO: Implementar obtenção do usuário autenticado
        return userService.findByUsername("admin")?.id ?: 1L
    }
}