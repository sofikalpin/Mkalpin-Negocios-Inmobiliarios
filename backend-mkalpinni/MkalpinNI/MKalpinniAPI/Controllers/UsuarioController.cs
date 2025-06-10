using Microsoft.AspNetCore.Mvc;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.DTO;
using MKalpinNI.API.Utilidad;

namespace MKalpinniAPI.Controllers
{
    // Define que esta clase es un controlador de API y especifica la ruta base para los endpoints.
    [ApiController]
    [Route("api/[controller]")] // La ruta será /api/Usuario
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        // Inyección de dependencias: El controlador recibe una instancia de IUsuarioService
        // a través de su constructor. Esto asume que IUsuarioService ya está registrado
        // en el contenedor de inyección de dependencias de tu aplicación (Startup.cs o Program.cs en .NET 6+).
        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // GET: api/Usuario/ObtenerTodos
        // Este endpoint devuelve una lista de todos los usuarios.
        [HttpGet]
        [Route("ObtenerTodos")] // Ruta específica para este método
        public async Task<IActionResult> ObtenerTodos()
        {
            var rsp = new Response<List<UsuarioDTO>>(); // Objeto para estandarizar las respuestas de la API.

            try
            {
                rsp.status = true;
                rsp.value = await _usuarioService.ObtenerTodos(); // Llama al servicio para obtener los usuarios.
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"Error: {ex.Message}";
                return StatusCode(404, rsp); // Devuelve un 404 si el usuario no se encontró por un TaskCanceledException
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener todos los usuarios: {ex.Message}";
                return StatusCode(500, rsp); // Devuelve un 500 en caso de otros errores.
            }

            return Ok(rsp); // Devuelve un 200 OK con la lista de usuarios.
        }

        // GET: api/Usuario/ObtenerPorId/5
        // Este endpoint devuelve un usuario por su ID.
        [HttpGet]
        [Route("ObtenerPorId/{id:int}")] // Ruta con parámetro de ID. ":int" asegura que el ID sea un entero.
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var rsp = new Response<UsuarioDTO>();

            try
            {
                rsp.status = true;
                rsp.value = await _usuarioService.ObtenerPorId(id);
            }
            catch (TaskCanceledException ex) // Captura TaskCanceledException para mensajes específicos
            {
                rsp.status = false;
                rsp.msg = $"Usuario no encontrado: {ex.Message}";
                return StatusCode(404, rsp); // Devuelve un 404 si el usuario no se encontró.
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al obtener usuario por ID: {ex.Message}";
                return StatusCode(500, rsp);
            }

            return Ok(rsp);
        }

        // POST: api/Usuario/Crear
        // Este endpoint permite crear un nuevo usuario.
        [HttpPost]
        [Route("Crear")]
        public async Task<IActionResult> Crear([FromBody] UsuarioDTO request) // [FromBody] indica que los datos vienen en el cuerpo de la solicitud.
        {
            var rsp = new Response<UsuarioDTO>();

            try
            {
                rsp.status = true;
                rsp.value = await _usuarioService.Crear(request);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"No se pudo crear el usuario: {ex.Message}";
                return StatusCode(400, rsp); // 400 Bad Request si la creación falló por alguna razón específica del negocio.
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al crear el usuario: {ex.Message}";
                return StatusCode(500, rsp);
            }

            return Ok(rsp); // 200 OK si se creó correctamente.
        }

        // PUT: api/Usuario/Editar
        // Este endpoint permite editar un usuario existente.
        [HttpPut]
        [Route("Editar")]
        public async Task<IActionResult> Editar([FromBody] UsuarioDTO request)
        {
            var rsp = new Response<bool>(); // Retorna un booleano indicando éxito o fracaso.

            try
            {
                rsp.status = true;
                rsp.value = await _usuarioService.Editar(request);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"Usuario no encontrado para editar: {ex.Message}";
                return StatusCode(404, rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al editar el usuario: {ex.Message}";
                return StatusCode(500, rsp);
            }

            return Ok(rsp);
        }

        // DELETE: api/Usuario/Eliminar/5
        // Este endpoint permite eliminar un usuario por su ID.
        [HttpDelete]
        [Route("Eliminar/{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var rsp = new Response<bool>(); // Retorna un booleano indicando éxito o fracaso.

            try
            {
                rsp.status = true;
                rsp.value = await _usuarioService.Eliminar(id);
            }
            catch (TaskCanceledException ex)
            {
                rsp.status = false;
                rsp.msg = $"Usuario no encontrado para eliminar: {ex.Message}";
                return StatusCode(404, rsp);
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al eliminar el usuario: {ex.Message}";
                return StatusCode(500, rsp);
            }

            return Ok(rsp);
        }

        // POST: api/Usuario/IniciarSesion
        // Este endpoint es para el inicio de sesión.
        [HttpPost]
        [Route("IniciarSesion")]
        public async Task<IActionResult> IniciarSesion([FromBody] LoginDTO request) // Necesitarás un DTO para el login.
        {
            var rsp = new Response<UsuarioDTO>();

            try
            {
                rsp.status = true;
                rsp.value = await _usuarioService.IniciarSesion(request.Correo, request.ContrasenaHash);
            }
            catch (TaskCanceledException ex) // Captura TaskCanceledException para credenciales inválidas.
            {
                rsp.status = false;
                rsp.msg = $"Credenciales inválidas: {ex.Message}";
                return Unauthorized(rsp); // 401 Unauthorized
            }
            catch (Exception ex)
            {
                rsp.status = false;
                rsp.msg = $"Error al iniciar sesión: {ex.Message}";
                return StatusCode(500, rsp);
            }

            return Ok(rsp);
        }
    }
}
