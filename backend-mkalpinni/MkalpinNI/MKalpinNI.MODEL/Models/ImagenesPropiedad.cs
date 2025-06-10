using System;
using System.Collections.Generic;

namespace MKalpinNI.Model.Models;

public partial class ImagenesPropiedad
{
    public int IdImagen { get; set; }

    public int IdPropiedad { get; set; }

    public string UrlImagen { get; set; } = null!;

    public bool? EsPrincipal { get; set; }

    public virtual Propiedade IdPropiedadNavigation { get; set; } = null!;
}
