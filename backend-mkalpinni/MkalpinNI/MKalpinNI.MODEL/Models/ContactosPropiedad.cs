using System;
using System.Collections.Generic;

namespace MKalpinNI.Model.Models;

public partial class ContactosPropiedad
{
    public int IdContacto { get; set; }

    public int IdPropiedad { get; set; }

    public string Nombre { get; set; } = null!;

    public string Correo { get; set; } = null!;

    public string? Telefono { get; set; }

    public string Mensaje { get; set; } = null!;

    public DateTime? FechaContacto { get; set; }

    public virtual Propiedade IdPropiedadNavigation { get; set; } = null!;
}
