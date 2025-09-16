package br.com.vrsoftware.vragentpdv.model.dto.monitor

data class DiskInfoDto(
    val minion: String,
    val diskUsage: Map<String, Map<String, Any>>?,
    val rootPartitionPercent: String?
)