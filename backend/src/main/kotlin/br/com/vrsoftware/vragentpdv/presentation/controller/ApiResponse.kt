package br.com.vrsoftware.vragentpdv.presentation.controller

class ApiResponse<T> private constructor(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null
) {
    companion object {
        fun <T> success(data: T): ApiResponse<T> {
            return ApiResponse(true, data, null)
        }

        fun <T> error(message: String): ApiResponse<T> {
            return ApiResponse(false, null, message)
        }
    }
}