package br.com.vrsoftware.vragentpdv.model.dto.system

data class HardwareInfoDto(
    val minion: String,
    val numCpus: Int?,
    val memTotal: Long?,
    val virtual: String?
)