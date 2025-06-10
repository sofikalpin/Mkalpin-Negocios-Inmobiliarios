using MKalpinNI.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IPropiedadService
    {
        Task<PropiedadeDTO> ObtenerPorId(int idPropiedad);
        Task<List<PropiedadeDTO>> ObtenerTodos();
        Task<PropiedadeDTO> Crear(PropiedadeDTO modelo);
        Task<bool> Editar(PropiedadeDTO modelo);
        Task<bool> Eliminar(int idPropiedad);
    }
}
