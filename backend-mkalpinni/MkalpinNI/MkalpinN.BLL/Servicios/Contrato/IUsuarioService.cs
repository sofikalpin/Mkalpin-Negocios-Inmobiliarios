using MKalpinNI.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IUsuarioService
    {
        Task<UsuarioDTO> ObtenerPorId(int idUsuario);
        Task<List<UsuarioDTO>> ObtenerTodos();
        Task<UsuarioDTO> Crear(UsuarioDTO modelo);
        Task<bool> Editar(UsuarioDTO modelo);
        Task<bool> Eliminar(int idUsuario);
        Task<UsuarioDTO> IniciarSesion(string correo, string clave); 
    }
}
