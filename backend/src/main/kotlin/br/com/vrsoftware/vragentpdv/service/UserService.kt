package br.com.vrsoftware.vragentpdv.service

import br.com.vrsoftware.vragentpdv.model.entity.User
import br.com.vrsoftware.vragentpdv.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository
) {

    fun findByUsername(username: String): User? {
        return userRepository.findByUsername(username)
    }

    fun findById(id: Long): User? {
        return userRepository.findById(id).orElse(null)
    }
}