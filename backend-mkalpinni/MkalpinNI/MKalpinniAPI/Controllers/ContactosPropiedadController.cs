using Microsoft.AspNetCore.Mvc;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.API.Utilidad;
using MKalpinNI.DTO;

namespace MKalpinniAPI.Controllers
{
     [Route("api/[controller]")]
    [ApiController]
    public class ContactosPropiedadController : ControllerBase
    {
        private readonly IContactoPropiedadService _contactoPropiedadService;

        public ContactosPropiedadController(IContactoPropiedadService contactoPropiedadService)
        {
            _contactoPropiedadService = contactoPropiedadService;
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            var response = new Response<List<ContactosPropiedadDTO>>();
            try
            {
                response.value = await _contactoPropiedadService.ObtenerTodos();
                response.status = true;
                response.msg = "OK";
            }
            catch (Exception ex)
            {
                response.status = false;
                response.msg = ex.Message;
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Guardar([FromBody] ContactosPropiedadDTO contactoPropiedad)
        {
            var response = new Response<ContactosPropiedadDTO>();
            try
            {
                response.value = await _contactoPropiedadService.Crear(contactoPropiedad);
                response.status = true;
                response.msg = "OK";
            }
            catch (Exception ex)
            {
                response.status = false;
                response.msg = ex.Message;
            }
            return Ok(response);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] ContactosPropiedadDTO contactoPropiedad)
        {
            var response = new Response<bool>();
            try
            {
                response.status = await _contactoPropiedadService.Editar(contactoPropiedad);
                response.value = response.status;
                response.msg = "OK";
            }
            catch (Exception ex)
            {
                response.status = false;
                response.msg = ex.Message;
            }
            return Ok(response);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var response = new Response<bool>();
            try
            {
                response.status = await _contactoPropiedadService.Eliminar(id);
                response.value = response.status;
                response.msg = "OK";
            }
            catch (Exception ex)
            {
                response.status = false;
                response.msg = ex.Message;
            }
            return Ok(response);
        }
    }
}

