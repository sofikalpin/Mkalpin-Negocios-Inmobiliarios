using System;
using System.Collections.Generic;
using System.Formats.Asn1;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MKalpinNI.DTO
{
    public class DocumentosUsuarioDTO
    {
        public int IdDocumento { get; set; }

        public int IdUsuario { get; set; }

        public string NombreArchivo { get; set; } = null!;

        public string RutaArchivo { get; set; } = null!;

        public string? TipoDocumento { get; set; }

        public DateTime? FechaSubida { get; set; }
    }
}
