using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MKalpinNI.DTO
{
    public class LoginDTO
    {
        public string Correo { get; set; } = null!;

        public string ContrasenaHash { get; set; } = null!;
    }
}
