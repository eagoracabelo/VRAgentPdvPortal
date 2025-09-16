package br.com.vrsoftware.vragentpdv.model.dto.monitor

data class NetworkMonitorDto(
    val minion: String,
    val interfaceIp: String?,
    val networkDevices: Map<String, Map<String, Any>>?
)