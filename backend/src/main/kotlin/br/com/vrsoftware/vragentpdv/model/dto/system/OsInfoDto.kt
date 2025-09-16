package br.com.vrsoftware.vragentpdv.model.dto.system

data class OsInfoDto(
    val minion: String,
    val os: String?,
    val osRelease: String?,
    val kernel: String?
)