using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MKalpinNI.DTO;


namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IPropiedadService
    {
        Task<List<PropiedadeDTO>> get
        Task<PropiedadeDTO> ObtenerPorId(int idPropiedad);
        Task<PropiedadeDTO> Crear(PropiedadeDTO modelo);
        Task<bool> Editar(PropiedadeDTO modelo);
        Task<bool> Eliminar(int idPropiedad);
        Task<List<PropiedadeDTO>> BuscarPropiedades(FiltroPropiedadDTO filtro);
        Task<bool> ToggleFavorito(int idPropiedad);
    }
}
