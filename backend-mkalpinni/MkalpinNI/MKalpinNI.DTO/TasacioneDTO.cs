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
    public class TasacioneDTO
    {
        public int IdTasacion { get; set; }

        public string Direccion { get; set; } = null!;

        public decimal MetrosCuadrados { get; set; }

        public int Habitaciones { get; set; }

        public int Banos { get; set; }

        public int AntiguedadAnios { get; set; }

        public string? DescripcionPropiedad { get; set; }

        public string TipoPropiedad { get; set; } = null!;

        public string EstadoPropiedad { get; set; } = null!;

        public string UbicacionTipo { get; set; } = null!;

        public string NombreContacto { get; set; } = null!;

        public string TelefonoContacto { get; set; } = null!;

        public string CorreoContacto { get; set; } = null!;

        public decimal? ValorEstimado { get; set; }

        public DateTime? FechaSolicitud { get; set; }
    }
}
