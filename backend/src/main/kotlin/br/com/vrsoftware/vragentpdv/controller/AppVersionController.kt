package br.com.vrsoftware.vragentpdv.controller

import br.com.vrsoftware.vragentpdv.model.dto.appversion.AppVersionListDto
import br.com.vrsoftware.vragentpdv.model.dto.appversion.AppVersionResultDto
import br.com.vrsoftware.vragentpdv.service.AppVersionService
import br.com.vrsoftware.vragentpdv.service.SaltApiService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/salt/app")
@CrossOrigin(origins = ["*"])
class AppVersionController(
    private val saltApiService: SaltApiService,
    private val appVersionService: AppVersionService
) {

    @PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadNewVersion(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("version") version: String,
        @RequestParam("description", required = false) description: String?,
        @RequestParam("targetMinions", defaultValue = "*") targetMinions: String,
        @RequestParam("autoApply", defaultValue = "false") autoApply: Boolean
    ): AppVersionResultDto {
        return appVersionService.uploadAndPrepareVersion(
            file, version, description, targetMinions, autoApply
        )
    }

    @PostMapping("/{version}/deploy")
    fun deployVersion(
        @PathVariable version: String,
        @RequestParam(defaultValue = "*") targetMinions: String
    ): AppVersionResultDto {
        return appVersionService.deployVersion(version, targetMinions)
    }

    @PostMapping("/{version}/rollback")
    fun rollbackToVersion(
        @PathVariable version: String,
        @RequestParam(defaultValue = "*") targetMinions: String
    ): AppVersionResultDto {
        return appVersionService.rollbackToVersion(version, targetMinions)
    }

    @GetMapping("/versions")
    fun listVersions(): AppVersionListDto {
        return appVersionService.listAvailableVersions()
    }

    @GetMapping("/current-version")
    fun getCurrentVersion(@RequestParam(defaultValue = "*") targetMinions: String): Map<String, Any?> {
        return appVersionService.getCurrentVersionFromMinions(targetMinions)
    }

    @DeleteMapping("/{version}")
    fun deleteVersion(@PathVariable version: String): AppVersionResultDto {
        return appVersionService.deleteVersion(version)
    }

    @PostMapping("/test/{version}")
    fun testVersion(
        @PathVariable version: String,
        @RequestParam(defaultValue = "*") targetMinions: String
    ): Map<String, Any?> {
        val result = saltApiService.executeCommand("salt", targetMinions, "state.apply vrpdv test=True")
        return saltApiService.parseGenericResult(result)
    }
}