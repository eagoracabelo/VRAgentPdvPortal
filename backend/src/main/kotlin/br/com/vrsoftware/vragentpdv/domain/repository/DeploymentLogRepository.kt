package br.com.vrsoftware.vragentpdv.domain.repository

import br.com.vrsoftware.vragentpdv.domain.model.DeploymentLog
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DeploymentLogRepository : JpaRepository<DeploymentLog, Long> {
    fun findByMinionId(minionId: String): List<DeploymentLog>
    fun findByMinionIdAndVersionId(minionId: String, versionId: Long): List<DeploymentLog>
}