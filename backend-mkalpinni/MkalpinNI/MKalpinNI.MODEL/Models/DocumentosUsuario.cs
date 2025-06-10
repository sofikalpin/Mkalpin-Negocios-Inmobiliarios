using System;
using System.Collections.Generic;

namespace MKalpinNI.Model.Models;

public partial class DocumentosUsuario
{
    public int IdDocumento { get; set; }

    public int IdUsuario { get; set; }

    public string NombreArchivo { get; set; } = null!;

    public string RutaArchivo { get; set; } = null!;

    public string? TipoDocumento { get; set; }

    public DateTime? FechaSubida { get; set; }

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
