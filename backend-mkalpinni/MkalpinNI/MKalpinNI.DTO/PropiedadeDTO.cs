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
    public class PropiedadeDTO
    {
        public int IdPropiedad { get; set; }

        public string Titulo { get; set; } = null!;

        public decimal Precio { get; set; }

        public string? Moneda { get; set; }

        public string Ubicacion { get; set; } = null!;

        public string Barrio { get; set; } = null!;

        public int Habitaciones { get; set; }

        public int Banos { get; set; }

        public decimal SuperficieM2 { get; set; }

        public string TipoPropiedad { get; set; } = null!;

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }

        public bool? EsFavorito { get; set; }

        public string? Descripcion { get; set; }

        public int? AntiguedadAnios { get; set; }

        public string? Orientacion { get; set; }

        public bool? AireAcondicionado { get; set; }

        public bool? Piscina { get; set; }

        public bool? Seguridad24hs { get; set; }

        public bool? CocinaEquipada { get; set; }

        public int? Estacionamientos { get; set; }

        public int IdPropietario { get; set; }

        public string TransaccionTipo { get; set; } = null!;

        public string? EstadoPropiedad { get; set; }

        public int? HuespedesMax { get; set; }

        public DateOnly? CheckIn { get; set; }

        public DateOnly? CheckOut { get; set; }
    }
}
