using Microsoft.AspNetCore.Mvc;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.Model.DTOs;
using MKalpinNI.API.Utilidad;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MKalpinniAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropiedadController : ControllerBase
    {
        private readonly IPropiedadService _propiedadService;
        private readonly ILogger<PropiedadController> _logger;

        public PropiedadController(IPropiedadService propiedadService, ILogger<PropiedadController> logger)
        {
            _propiedadService = propiedadService;
            _logger = logger;
        }

        [HttpGet]
        [Route("ObtenerTodos")]
        public async Task<IActionResult> ObtenerTodos()
        {
            var rsp = new Response<List<PropiedadDTO>>();
            try
            {
                _logger.LogInformation("Obteniendo todas las propiedades.");
                rsp.status = true;
                rsp.value = await _propiedadService.ObtenerTodos();
                _logger.LogInformation($"Se obtuvieron {rsp.value?.Count ?? 0} propiedades.");
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener todas las propiedades: {ex.Message}";
                _logger.LogError(ex, "Error al obtener todas las propiedades.");
            }
            return Ok(rsp);
        }

        [HttpGet]
        [Route("ObtenerPorId/{id:int}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var rsp = new Response<PropiedadDTO>();
            try
            {
                if (id <= 0)
                {
                    rsp.status = false;
                    rsp.msg = "El ID de la propiedad debe ser mayor a 0.";
                    return BadRequest(rsp);
                }

                _logger.LogInformation($"Obteniendo propiedad con ID: {id}.");
                rsp.value = await _propiedadService.ObtenerPorId(id);
                rsp.status = true;
                if (rsp.value == null)
                {
                    rsp.status = false;
                    rsp.msg = $"No se encontró la propiedad con ID: {id}.";
                    return NotFound(rsp);
                }
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener propiedad por ID: {ex.Message}";
                _logger.LogError(ex, $"Error al obtener propiedad con ID: {id}.");
            }
            return Ok(rsp);
        }

        [HttpPost]
        [Route("Crear")]
        public async Task<IActionResult> Crear([FromBody] PropiedadDTO request)
        {
            var rsp = new Response<PropiedadDTO>();
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

                _logger.LogInformation("Creando nueva propiedad.");
                rsp.value = await _propiedadService.Crear(request);
                rsp.status = true;
                rsp.msg = "Propiedad creada exitosamente.";
                _logger.LogInformation($"Propiedad creada con ID: {rsp.value.IdPropiedad}.");
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al crear la propiedad: {ex.Message}";
                _logger.LogError(ex, "Error al crear la propiedad.");
            }
            return Ok(rsp);
        }

        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] PropiedadDTO request)
        {
            var rsp = new Response<bool>();
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

                if (request.IdPropiedad <= 0)
                {
                    rsp.status = false;
                    rsp.msg = "El ID de la propiedad es requerido y debe ser mayor a 0.";
                    return BadRequest(rsp);
                }

                _logger.LogInformation($"Editando propiedad con ID: {request.IdPropiedad}.");
                rsp.value = await _propiedadService.Editar(request);
                rsp.status = true;
                rsp.msg = "Propiedad actualizada con éxito.";
                _logger.LogInformation($"Propiedad con ID {request.IdPropiedad} editada exitosamente.");
            }
            catch (KeyNotFoundException ex)
            {
                rsp.status = false;
                rsp.msg = $"Propiedad no encontrada para editar: {ex.Message}";
                _logger.LogWarning($"Propiedad con ID {request.IdPropiedad} no encontrada para editar.");
                return NotFound(rsp);
            }
            catch (ArgumentException ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;
                _logger.LogWarning($"Validación fallida al editar propiedad: {ex.Message}");
                return BadRequest(rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al editar la propiedad: {ex.Message}";
                _logger.LogError(ex, $"Error al editar propiedad con ID: {request.IdPropiedad}.");
            }
            return Ok(rsp);
        }

        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var rsp = new Response<bool>();
            try
            {
                if (id <= 0)
                {
                    rsp.status = false;
                    rsp.msg = "El ID de la propiedad debe ser mayor a 0.";
                    return BadRequest(rsp);
                }

                _logger.LogInformation($"Eliminando propiedad con ID: {id}.");
                rsp.value = await _propiedadService.Eliminar(id);
                rsp.status = true;
                rsp.msg = "Propiedad eliminada con éxito.";
                _logger.LogInformation($"Propiedad con ID {id} eliminada exitosamente.");
            }
            catch (KeyNotFoundException ex)
            {
                rsp.status = false;
                rsp.msg = $"Propiedad no encontrada para eliminar: {ex.Message}";
                _logger.LogWarning($"Propiedad con ID {id} no encontrada para eliminar.");
                return NotFound(rsp);
            }
            catch (ArgumentException ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;
                _logger.LogWarning($"Validación fallida al eliminar propiedad: {ex.Message}");
                return BadRequest(rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al eliminar la propiedad: {ex.Message}";
                _logger.LogError(ex, $"Error al eliminar propiedad con ID: {id}.");
            }
            return Ok(rsp);
        }

        [HttpGet]
        [Route("Buscar")]
        public async Task<IActionResult> BuscarPorCriterios(
            [FromQuery] string? ubicacion = null,
            [FromQuery] string? barrio = null,
            [FromQuery] decimal? precioMin = null,
            [FromQuery] decimal? precioMax = null,
            [FromQuery] int? habitacionesMin = null,
            [FromQuery] string? tipoPropiedad = null,
            [FromQuery] string? transaccionTipo = null)
        {
            var rsp = new Response<List<PropiedadDTO>>();
            try
            {
                _logger.LogInformation("Buscando propiedades con criterios específicos.");
                rsp.status = true;
                rsp.value = await _propiedadService.BuscarPorCriterios(
                    ubicacion, barrio, precioMin, precioMax,
                    habitacionesMin, tipoPropiedad, transaccionTipo);
                _logger.LogInformation($"Se encontraron {rsp.value?.Count ?? 0} propiedades.");
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al buscar propiedades: {ex.Message}";
                _logger.LogError(ex, "Error al buscar propiedades por criterios.");
            }
            return Ok(rsp);
        }

        [HttpGet]
        [Route("ObtenerPorPropietario/{idPropietario:int}")]
        public async Task<IActionResult> ObtenerPorPropietario(int idPropietario)
        {
            var rsp = new Response<List<PropiedadDTO>>();
            try
            {
                if (idPropietario <= 0)
                {
                    rsp.status = false;
                    rsp.msg = "El ID del propietario debe ser mayor a 0.";
                    return BadRequest(rsp);
                }

                _logger.LogInformation($"Obteniendo propiedades del propietario con ID: {idPropietario}.");
                rsp.status = true;
                rsp.value = await _propiedadService.ObtenerPorPropietario(idPropietario);
                _logger.LogInformation($"Se obtuvieron {rsp.value?.Count ?? 0} propiedades del propietario.");
            }
            catch (ArgumentException ex)
            {
                rsp.status = false;
                rsp.msg = ex.Message;
                _logger.LogWarning($"Validación fallida al obtener propiedades por propietario: {ex.Message}");
                return BadRequest(rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener propiedades del propietario: {ex.Message}";
                _logger.LogError(ex, $"Error al obtener propiedades del propietario con ID: {idPropietario}.");
            }
            return Ok(rsp);
        }

        [HttpGet]
        [Route("Estadisticas")]
        public async Task<IActionResult> ObtenerEstadisticas()
        {
            var rsp = new Response<object>();
            try
            {
                _logger.LogInformation("Obteniendo estadísticas de propiedades.");
                var propiedades = await _propiedadService.ObtenerTodos();

                var estadisticas = new
                {
                    TotalPropiedades = propiedades.Count,
                    PropiedadesEnVenta = propiedades.Count(p => p.TransaccionTipo.Equals("Venta", StringComparison.OrdinalIgnoreCase)),
                    PropiedadesEnAlquiler = propiedades.Count(p => p.TransaccionTipo.Equals("Alquiler", StringComparison.OrdinalIgnoreCase)),
                    PrecioPromedio = propiedades.Any() ? propiedades.Average(p => p.Precio) : 0,
                    PrecioMinimo = propiedades.Any() ? propiedades.Min(p => p.Precio) : 0,
                    PrecioMaximo = propiedades.Any() ? propiedades.Max(p => p.Precio) : 0,
                    SuperficiePromedio = propiedades.Any() ? propiedades.Average(p => p.SuperficieM2) : 0,
                    DistribucionPorTipo = propiedades.GroupBy(p => p.TipoPropiedad)
                        .Select(g => new { Tipo = g.Key, Cantidad = g.Count() })
                        .OrderByDescending(x => x.Cantidad)
                        .ToList()
                };

                rsp.status = true;
                rsp.value = estadisticas;
                _logger.LogInformation("Estadísticas obtenidas exitosamente.");
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener estadísticas: {ex.Message}";
                _logger.LogError(ex, "Error al obtener estadísticas de propiedades.");
            }
            return Ok(rsp);
        }
    }
}