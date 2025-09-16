package br.com.vrsoftware.vragentpdv.model.dto.monitor

data class CpuInfoDto(
    val minion: String,
    val cpuUsage: String?,
    val loadAverage: Map<String, Double>?
)