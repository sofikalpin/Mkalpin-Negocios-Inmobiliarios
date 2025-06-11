using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using MKalpinNI.DTO; 

namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IContactoPropiedadService
    {
        Task<ContactosPropiedadDTO> ObtenerPorId(int idContacto);
        Task<List<ContactosPropiedadDTO>> ObtenerTodos();
        Task<ContactosPropiedadDTO> Crear(ContactosPropiedadDTO modelo);
        Task<bool> Eliminar(int idContacto);
        Task<bool> Editar(ContactosPropiedadDTO modelo);
        Task<List<ContactosPropiedadDTO>> BuscarPorEmailOPropiedad(string email, int? idPropiedad); // Ejemplo de búsqueda
    }
    
}