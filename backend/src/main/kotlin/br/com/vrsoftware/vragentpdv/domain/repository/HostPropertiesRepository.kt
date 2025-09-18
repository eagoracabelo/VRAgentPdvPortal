package br.com.vrsoftware.vragentpdv.domain.repository

import br.com.vrsoftware.vragentpdv.domain.model.HostProperties
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface HostPropertiesRepository : JpaRepository<HostProperties, Long> {
    fun findByMinionIdAndPropertyKey(minionId: String, propertyKey: String): HostProperties?
    fun deleteByMinionIdAndPropertyKey(minionId: String, propertyKey: String)
    fun existsByMinionIdAndPropertyKey(minionId: String, propertyKey: String): Boolean
    fun findByMinionId(minionId: String): List<HostProperties>
}