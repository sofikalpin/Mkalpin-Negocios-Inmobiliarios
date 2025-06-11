using MKalpinNI.DTO;
using System;
using System.Collections.Generic;

namespace MKalpinNI.Model.DTOs;

public class PropiedadDTO
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
    public string TransaccionTipo { get; set; } = null!;
    public string? EstadoPropiedad { get; set; }
    public int? HuespedesMax { get; set; }
    public DateOnly? CheckIn { get; set; }
    public DateOnly? CheckOut { get; set; }
    public int IdPropietario { get; set; }

    public UsuarioDTO? Propietario { get; set; } 
    public ICollection<ImagenesPropiedadDTO> Imagenes { get; set; } = new List<ImagenesPropiedadDTO>();
    public ICollection<ContactosPropiedadDTO> Contactos { get; set; } = new List<ContactosPropiedadDTO>();
}