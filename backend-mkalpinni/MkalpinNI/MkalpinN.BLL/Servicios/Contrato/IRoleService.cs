using MKalpinNI.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IRoleService
    {
        Task<RoleDTO> ObtenerPorId(int idRol);
        Task<List<RoleDTO>> ObtenerTodos();
        Task<RoleDTO> Crear(RoleDTO modelo);
        Task<bool> Editar(RoleDTO modelo);
        Task<bool> Eliminar(int idRol);
    }
}
