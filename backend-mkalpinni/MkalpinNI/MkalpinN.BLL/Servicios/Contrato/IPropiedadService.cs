using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MKalpinNI.DTO;
using MKalpinNI.Model.DTOs;


namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IPropiedadService
    {
        Task<PropiedadDTO> ObtenerPorId(int idPropiedad);

        Task<PropiedadDTO> Crear(PropiedadDTO modelo);

        Task<bool> Editar(PropiedadDTO modelo);

        Task<bool> Eliminar(int idPropiedad);
        Task<List<PropiedadDTO>> ObtenerTodos();

        Task<List<PropiedadDTO>> BuscarPorCriterios(
            string? ubicacion = null,
            string? barrio = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            int? habitacionesMin = null,
            string? tipoPropiedad = null,
            string? transaccionTipo = null);
        Task<List<PropiedadDTO>> ObtenerPorPropietario(int idPropietario);
    }
        
}
