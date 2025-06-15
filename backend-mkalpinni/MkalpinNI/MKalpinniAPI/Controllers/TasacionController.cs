using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.DTO;
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
        public class TasacionController : ControllerBase
        {
            private readonly ITasacionService _tasacionService;
            private readonly ILogger<TasacionController> _logger;

            public TasacionController(ITasacionService tasacionService, ILogger<TasacionController> logger)
            {
                _tasacionService = tasacionService;
                _logger = logger;
            }

            [HttpGet]
            [Route("ObtenerTodos")]
            public async Task<IActionResult> ObtenerTodos()
            {
                var rsp = new Response<List<TasacioneDTO>>();
                try
                {
                    _logger.LogInformation("Obteniendo todas las tasaciones.");
                    rsp.status = true;
                    rsp.value = await _tasacionService.ObtenerTodas();
                    _logger.LogInformation($"Se obtuvieron {rsp.value?.Count ?? 0} tasaciones.");
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al obtener todas las tasaciones: {ex.Message}";
                    _logger.LogError(ex, "Error al obtener todas las tasaciones.");
                }
                return Ok(rsp);
            }

            [HttpGet]
            [Route("ObtenerPorId/{id:int}")]
            public async Task<IActionResult> ObtenerPorId(int id)
            {
                var rsp = new Response<TasacioneDTO>();
                try
                {
                    if (id <= 0)
                    {
                        rsp.status = false;
                        rsp.msg = "El ID de la tasación debe ser mayor a 0.";
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation($"Obteniendo tasación con ID: {id}.");
                    rsp.value = await _tasacionService.ObtenerPorId(id);
                    rsp.status = true;
                    if (rsp.value == null)
                    {
                        rsp.status = false;
                        rsp.msg = $"No se encontró la tasación con ID: {id}.";
                        return NotFound(rsp);
                    }
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al obtener tasación por ID: {ex.Message}";
                    _logger.LogError(ex, $"Error al obtener tasación con ID: {id}.");
                }
                return Ok(rsp);
            }

            [HttpPost]
            [Route("Crear")]
            public async Task<IActionResult> Crear([FromBody] TasacioneDTO request)
            {
                var rsp = new Response<TasacioneDTO>();
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

                    _logger.LogInformation("Creando nueva tasación.");
                    rsp.value = await _tasacionService.Crear(request);
                    rsp.status = true;
                    rsp.msg = "Tasación creada exitosamente.";
                    _logger.LogInformation($"Tasación creada con ID: {rsp.value.IdTasacion}.");
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al crear la tasación: {ex.Message}";
                    _logger.LogError(ex, "Error al crear la tasación.");
                }
                return Ok(rsp);
            }

            [HttpPut]
            [Route("Editar")]
            public async Task<IActionResult> Editar([FromBody] TasacioneDTO request)
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

                    if (request.IdTasacion <= 0)
                    {
                        rsp.status = false;
                        rsp.msg = "El ID de la tasación es requerido y debe ser mayor a 0.";
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation($"Editando tasación con ID: {request.IdTasacion}.");
                    rsp.value = await _tasacionService.Editar(request);
                    rsp.status = true;
                    rsp.msg = "Tasación actualizada con éxito.";
                    _logger.LogInformation($"Tasación con ID {request.IdTasacion} editada exitosamente.");
                }
                catch (KeyNotFoundException ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Tasación no encontrada para editar: {ex.Message}";
                    _logger.LogWarning($"Tasación con ID {request.IdTasacion} no encontrada para editar.");
                    return NotFound(rsp);
                }
                catch (ArgumentException ex)
                {
                    rsp.status = false;
                    rsp.msg = ex.Message;
                    _logger.LogWarning($"Validación fallida al editar tasación: {ex.Message}");
                    return BadRequest(rsp);
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al editar la tasación: {ex.Message}";
                    _logger.LogError(ex, $"Error al editar tasación con ID: {request.IdTasacion}.");
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
                        rsp.msg = "El ID de la tasación debe ser mayor a 0.";
                        return BadRequest(rsp);
                    }

                    _logger.LogInformation($"Eliminando tasación con ID: {id}.");
                    rsp.value = await _tasacionService.Eliminar(id);
                    rsp.status = true;
                    rsp.msg = "Tasación eliminada con éxito.";
                    _logger.LogInformation($"Tasación con ID {id} eliminada exitosamente.");
                }
                catch (KeyNotFoundException ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Tasación no encontrada para eliminar: {ex.Message}";
                    _logger.LogWarning($"Tasación con ID {id} no encontrada para eliminar.");
                    return NotFound(rsp);
                }
                catch (ArgumentException ex)
                {
                    rsp.status = false;
                    rsp.msg = ex.Message;
                    _logger.LogWarning($"Validación fallida al eliminar tasación: {ex.Message}");
                    return BadRequest(rsp);
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al eliminar la tasación: {ex.Message}";
                    _logger.LogError(ex, $"Error al eliminar tasación con ID: {id}.");
                }
                return Ok(rsp);
            }

            [HttpGet]
            [Route("Buscar")]
            public async Task<IActionResult> Buscar([FromQuery] string criterio)
            {
                var rsp = new Response<List<TasacioneDTO>>();
                try
                {
                    _logger.LogInformation("Buscando tasaciones con criterios específicos.");
                    rsp.status = true;
                    rsp.value = await _tasacionService.BuscarPorCriterio(criterio);
                    _logger.LogInformation($"Se encontraron {rsp.value?.Count ?? 0} tasaciones.");
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al buscar tasaciones: {ex.Message}";
                    _logger.LogError(ex, "Error al buscar tasaciones por criterios.");
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
                    _logger.LogInformation("Obteniendo estadísticas de tasaciones.");
                    var tasaciones = await _tasacionService.ObtenerTodas();

                    var estadisticas = new
                    {
                        TotalTasaciones = tasaciones.Count,
                        ValorEstimadoPromedio = tasaciones.Any() ? tasaciones.Average(t => t.ValorEstimado ?? 0) : 0,
                        ValorMinimo = tasaciones.Any() ? tasaciones.Min(t => t.ValorEstimado ?? 0) : 0,
                        ValorMaximo = tasaciones.Any() ? tasaciones.Max(t => t.ValorEstimado ?? 0) : 0,
                        DistribucionPorTipo = tasaciones.GroupBy(t => t.TipoPropiedad)
                            .Select(g => new { Tipo = g.Key, Cantidad = g.Count() })
                            .OrderByDescending(x => x.Cantidad)
                            .ToList(),
                        TasacionesRecientes = tasaciones
                            .OrderByDescending(t => t.FechaSolicitud)
                            .Take(5)
                            .Select(t => new {
                                t.IdTasacion,
                                t.Direccion,
                                t.ValorEstimado,
                                t.FechaSolicitud
                            })
                    };

                    rsp.status = true;
                    rsp.value = estadisticas;
                    _logger.LogInformation("Estadísticas de tasaciones obtenidas exitosamente.");
                }
                catch (Exception ex)
                {
                    rsp.status = false;
                    rsp.msg = $"Error al obtener estadísticas: {ex.Message}";
                    _logger.LogError(ex, "Error al obtener estadísticas de tasaciones.");
                }
                return Ok(rsp);
            }
        }
    }