using MKalpinNI.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IDocumentosUsuarioService
    {
        Task<DocumentosUsuarioDTO> ObtenerPorId(int idDocumento);
        Task<List<DocumentosUsuarioDTO>> ObtenerTodos();
        Task<List<DocumentosUsuarioDTO>> ObtenerPorIdUsuario(int idUsuario); // Método específico
        Task<DocumentosUsuarioDTO> Crear(DocumentosUsuarioDTO modelo);
        Task<bool> Eliminar(int idDocumento);
    }
}
