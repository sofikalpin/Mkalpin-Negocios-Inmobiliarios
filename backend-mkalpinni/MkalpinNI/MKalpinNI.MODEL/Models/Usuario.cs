using System;
using System.Collections.Generic;

namespace MKalpinNI.Model.Models;

public partial class Usuario
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

    public virtual ICollection<DocumentosUsuario> DocumentosUsuarios { get; set; } = new List<DocumentosUsuario>();

    public virtual Role IdRolNavigation { get; set; } = null!;

    public virtual ICollection<Propiedade> Propiedades { get; set; } = new List<Propiedade>();
}
