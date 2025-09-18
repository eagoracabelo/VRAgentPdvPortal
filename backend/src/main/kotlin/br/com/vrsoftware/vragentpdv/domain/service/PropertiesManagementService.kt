package br.com.vrsoftware.vragentpdv.domain.service

import br.com.vrsoftware.vragentpdv.domain.model.HostProperties
import br.com.vrsoftware.vragentpdv.domain.repository.HostPropertiesRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class PropertiesManagementService(
    private val propertiesRepository: HostPropertiesRepository,
    private val saltService: SaltService
) {

    fun getProperties(minionId: String): Map<String, String> {
        val grains = saltService.getGrains(minionId)
        val propertiesPath = grains["properties_path"] as? String
            ?: throw IllegalArgumentException("Properties path not configured for minion $minionId")

        return saltService.getProperties(minionId, propertiesPath)
    }

    fun updateProperty(minionId: String, key: String, value: String): Boolean {
        // Atualizar no banco
        val existing = propertiesRepository.findByMinionIdAndPropertyKey(minionId, key)

        if (existing != null) {
            propertiesRepository.save(existing.copy(propertyValue = value))
        } else {
            propertiesRepository.save(
                HostProperties(
                    minionId = minionId,
                    propertyKey = key,
                    propertyValue = value
                )
            )
        }

        // Aplicar mudança via Salt
        val pillarData = mapOf(
            "property_key" to key,
            "property_value" to value
        )

        val result = saltService.executeState(minionId, "update-property", pillarData)
        return result.success
    }

    fun removeProperty(minionId: String, key: String): Boolean {
        // Remover do banco
        propertiesRepository.deleteByMinionIdAndPropertyKey(minionId, key)

        // Aplicar mudança via Salt
        val pillarData = mapOf("property_key" to key)
        val result = saltService.executeState(minionId, "remove-property", pillarData)
        return result.success
    }

    fun addProperty(minionId: String, key: String, value: String): Boolean {
        if (propertiesRepository.existsByMinionIdAndPropertyKey(minionId, key)) {
            throw IllegalArgumentException("Property $key already exists for minion $minionId")
        }

        return updateProperty(minionId, key, value)
    }
}