package br.com.vrsoftware.vragentpdv.domain.repository

import br.com.vrsoftware.vragentpdv.domain.model.ApplicationVersion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ApplicationVersionRepository : JpaRepository<ApplicationVersion, Long> {
    fun findByVersion(version: String): ApplicationVersion?
    fun existsByVersion(version: String): Boolean
}