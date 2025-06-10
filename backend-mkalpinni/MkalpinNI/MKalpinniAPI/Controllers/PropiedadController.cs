using Microsoft.AspNetCore.Mvc;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.DTO;
using MKalpinNI.API.Utilidad;

namespace MKalpinniAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class PropiedadController : ControllerBase
    {
        private readonly IPropiedadService _propiedadService;

        public PropiedadController(IPropiedadService propiedadService)
        {
            _propiedadService = propiedadService;
        }

        // GET: api/Propiedad/ObtenerTodos
        [HttpGet]
        [Route("ObtenerTodos")]
        public async Task<IActionResult> ObtenerTodos()
        {
            var rsp = new Response<List<PropiedadeDTO>>();
            try
            {
                rsp.status = true;
                rsp.value = await _propiedadService.ObtenerTodos();
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener todas las propiedades: {ex.Message}";
                return StatusCode(500, rsp);
            }
            return Ok(rsp);
        }

        // GET: api/Propiedad/ObtenerPorId/5
        [HttpGet]
        [Route("ObtenerPorId/{id:int}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var rsp = new Response<PropiedadeDTO>();
            try
            {
                rsp.status = true;
                rsp.value = await _propiedadService.ObtenerPorId(id);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"Propiedad no encontrada: {ex.Message}";
                return StatusCode(404, rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener propiedad por ID: {ex.Message}";
                return StatusCode(500, rsp);
            }
            return Ok(rsp);
        }

        // POST: api/Propiedad/Crear
        [HttpPost]
        [Route("Crear")]
        public async Task<IActionResult> Crear([FromBody] PropiedadeDTO request)
        {
            var rsp = new Response<PropiedadeDTO>();
            try
            {
                rsp.status = true;
                rsp.value = await _propiedadService.Crear(request);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"No se pudo crear la propiedad: {ex.Message}";
                return StatusCode(400, rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al crear la propiedad: {ex.Message}";
                return StatusCode(500, rsp);
            }
            return Ok(rsp);
        }

        // PUT: api/Propiedad/Editar
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] PropiedadeDTO request)
        {
            var rsp = new Response<bool>();
            try
            {
                rsp.status = true;
                rsp.value = await _propiedadService.Editar(request);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"Propiedad no encontrada para editar: {ex.Message}";
                return StatusCode(404, rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al editar la propiedad: {ex.Message}";
                return StatusCode(500, rsp);
            }
            return Ok(rsp);
        }

        // DELETE: api/Propiedad/Eliminar/5
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var rsp = new Response<bool>();
            try
            {
                rsp.status = true;
                rsp.value = await _propiedadService.Eliminar(id);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"Propiedad no encontrada para eliminar: {ex.Message}";
                return StatusCode(404, rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al eliminar la propiedad: {ex.Message}";
                return StatusCode(500, rsp);
            }
            return Ok(rsp);
        }
    }
}
