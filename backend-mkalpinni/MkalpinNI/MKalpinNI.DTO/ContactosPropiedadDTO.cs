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
    public class ContactosPropiedadDTO
    {
        public int IdContacto { get; set; }

        public int IdPropiedad { get; set; }

        public string Nombre { get; set; } = null!;

        public string Correo { get; set; } = null!;

        public string? Telefono { get; set; }

        public string Mensaje { get; set; } = null!;

        public DateTime? FechaContacto { get; set; }

    }
}
