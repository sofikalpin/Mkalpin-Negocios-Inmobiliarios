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
    public class ImagenesPropiedadDTO
    {
        public int IdImagen { get; set; }

        public int IdPropiedad { get; set; }

        public string UrlImagen { get; set; } = null!;

        public bool? EsPrincipal { get; set; }
    }
}
