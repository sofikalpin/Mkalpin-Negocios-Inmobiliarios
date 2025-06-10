using MKalpinNI.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface ITasacionService
    {
        Task<TasacioneDTO> ObtenerPorId(int idTasacion);
        Task<List<TasacioneDTO>> ObtenerTodas();
        Task<TasacioneDTO> Crear(TasacioneDTO modelo);
        Task<bool> Editar(TasacioneDTO modelo);
        Task<bool> Eliminar(int idTasacion);
        Task<List<TasacioneDTO>> BuscarPorCriterio(string criterio); 
    }
}
