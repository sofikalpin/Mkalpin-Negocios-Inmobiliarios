using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc;
    using MkalpinN.BLL.Servicios.Contrato;
    using MKalpinNI.DTO; // Asegúrate de que esta ruta sea correcta para tu DTO
    using MKalpinNI.API.Utilidad; // Asegúrate de que esta ruta sea correcta para tu clase Response
    using Microsoft.Extensions.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq; // Necesario para .SelectMany y .Select
    using System.Threading.Tasks;

    namespace MKalpinniAPI.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class ImagenesPropiedadController : ControllerBase
        {
            private readonly IImagenesPropiedadService _imagenesPropiedadService;
            private readonly ILogger<ImagenesPropiedadController> _logger;

            public ImagenesPropiedadController(IImagenesPropiedadService imagenesPropiedadService, ILogger<ImagenesPropiedadController> logger)
            {
                _imagenesPropiedadService = imagenesPropiedadService;
                _logger = logger;
            }

            [HttpGet]
            [Route("ObtenerPorId/{idImagen:int}")]
            public async Task<IActionResult> ObtenerPorId(int idImagen)
            {
                var rsp = new Response<ImagenesPropiedadDTO>();
                try
                {
                    if (idImagen <= 0)
                    {
                        rsp.status = false;
                        rsp.msg = "El ID de la imagen debe ser mayor a 0.";
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation($"Obteniendo imagen de propiedad con ID: {idImagen}.");
                    rsp.value = await _imagenesPropiedadService.ObtenerPorId(idImagen);
                    rsp.status = true;

                    if (rsp.value == null)
                    {
                        rsp.status = false;
                        rsp.msg = $"No se encontró la imagen de propiedad con ID: {idImagen}.";
                        return NotFound(rsp);
                    }
                }
                catch (TaskCanceledException ex) // Captura específica para "no encontrada" desde el servicio
                {
                    rsp.status = false;
                    rsp.msg = $"Imagen de propiedad no encontrada: {ex.Message}";
                    _logger.LogWarning($"Imagen de propiedad con ID {idImagen} no encontrada.");
                    return NotFound(rsp);
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al obtener imagen por ID: {ex.Message}";
                    _logger.LogError(ex, $"Error al obtener imagen de propiedad con ID: {idImagen}.");
                }
                return Ok(rsp);
            }

            [HttpGet]
            [Route("ObtenerTodas")]
            public async Task<IActionResult> ObtenerTodas()
            {
                var rsp = new Response<List<ImagenesPropiedadDTO>>();
                try
                {
                    _logger.LogInformation("Obteniendo todas las imágenes de propiedad.");
                    rsp.status = true;
                    rsp.value = await _imagenesPropiedadService.ObtenerTodas();
                    _logger.LogInformation($"Se obtuvieron {rsp.value?.Count ?? 0} imágenes de propiedad.");
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al obtener todas las imágenes de propiedad: {ex.Message}";
                    _logger.LogError(ex, "Error al obtener todas las imágenes de propiedad.");
                }
                return Ok(rsp);
            }

            [HttpGet]
            [Route("ObtenerPorIdPropiedad/{idPropiedad:int}")]
            public async Task<IActionResult> ObtenerPorIdPropiedad(int idPropiedad)
            {
                var rsp = new Response<List<ImagenesPropiedadDTO>>();
                try
                {
                    if (idPropiedad <= 0)
                    {
                        rsp.status = false;
                        rsp.msg = "El ID de la propiedad debe ser mayor a 0.";
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation($"Obteniendo imágenes para la propiedad con ID: {idPropiedad}.");
                    rsp.status = true;
                    rsp.value = await _imagenesPropiedadService.ObtenerPorIdPropiedad(idPropiedad);
                    _logger.LogInformation($"Se obtuvieron {rsp.value?.Count ?? 0} imágenes para la propiedad {idPropiedad}.");
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al obtener imágenes de propiedad por ID de propiedad: {ex.Message}";
                    _logger.LogError(ex, $"Error al obtener imágenes de propiedad por ID de propiedad: {idPropiedad}.");
                }
                return Ok(rsp);
            }

            [HttpPost]
            [Route("Crear")]
            public async Task<IActionResult> Crear([FromBody] ImagenesPropiedadDTO request)
            {
                var rsp = new Response<ImagenesPropiedadDTO>();
                try
                {
                    if (!ModelState.IsValid)
                    {
                        rsp.status = false;
                        rsp.msg = "Datos de entrada inválidos.";
                        var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                        rsp.msg += " " + string.Join("; ", errors);
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation("Creando nueva imagen de propiedad.");
                    rsp.value = await _imagenesPropiedadService.Crear(request);
                    rsp.status = true;
                    rsp.msg = "Imagen de propiedad creada exitosamente.";
                    _logger.LogInformation($"Imagen de propiedad creada con ID: {rsp.value.IdImagen}.");
                }
                catch (TaskCanceledException ex) // Captura específica para "no se pudo crear" desde el servicio
                {
                    rsp.status = false;
                    rsp.msg = $"No se pudo crear la imagen de propiedad: {ex.Message}";
                    _logger.LogWarning($"Fallo al crear la imagen de propiedad: {ex.Message}");
                    return BadRequest(rsp);
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al crear la imagen de propiedad: {ex.Message}";
                    _logger.LogError(ex, "Error al crear la imagen de propiedad.");
                }
                return Ok(rsp);
            }

            [HttpDelete]
            [Route("Eliminar/{idImagen:int}")]
            public async Task<IActionResult> Eliminar(int idImagen)
            {
                var rsp = new Response<bool>();
                try
                {
                    if (idImagen <= 0)
                    {
                        rsp.status = false;
                        rsp.msg = "El ID de la imagen debe ser mayor a 0.";
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation($"Eliminando imagen de propiedad con ID: {idImagen}.");
                    rsp.value = await _imagenesPropiedadService.Eliminar(idImagen);
                    rsp.status = true;
                    rsp.msg = "Imagen de propiedad eliminada con éxito.";
                    _logger.LogInformation($"Imagen de propiedad con ID {idImagen} eliminada exitosamente.");
                }
                catch (TaskCanceledException ex) // Captura específica para "no encontrada" desde el servicio
                {
                    rsp.status = false;
                    rsp.msg = $"Imagen de propiedad no encontrada para eliminar: {ex.Message}";
                    _logger.LogWarning($"Imagen de propiedad con ID {idImagen} no encontrada para eliminar.");
                    return NotFound(rsp);
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al eliminar la imagen de propiedad: {ex.Message}";
                    _logger.LogError(ex, $"Error al eliminar imagen de propiedad con ID: {idImagen}.");
                }
                return Ok(rsp);
            }
        }
    }

