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
   public class UsuarioDTO
   {
        public int IdUsuario { get; set; }

        public string Nombre { get; set; } = null!;

        public string Apellido { get; set; } = null!;

        public string Correo { get; set; } = null!;

        public string ContrasenaHash { get; set; } = null!;

        public string? Telefono { get; set; }

        public string? Dni { get; set; }

        public int IdRol { get; set; }

        public DateTime? FechaRegistro { get; set; }

        public string? TokenRecuperacion { get; set; }

        public DateTime? TokenExpiracion { get; set; }

        public bool? AutProf { get; set; }

        public string? FotoRuta { get; set; }

    }
}
