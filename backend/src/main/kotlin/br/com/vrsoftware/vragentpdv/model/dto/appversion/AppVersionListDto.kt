package br.com.vrsoftware.vragentpdv.model.dto.appversion

data class AppVersionListDto(
    val currentVersion: String?,
    val availableVersions: List<AppVersionInfo>
)