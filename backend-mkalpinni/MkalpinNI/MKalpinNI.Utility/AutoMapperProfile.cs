using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MKalpinNI.DTO;
using MKalpinNI.Model;
using MKalpinNI.Model.Models;

namespace MKalpinNI.Utility
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Tasacione
            CreateMap<Tasacione, TasacioneDTO>().ReverseMap();
            #endregion Tasacione
            #region Role
            CreateMap<Role,RoleDTO>().ReverseMap();
            #endregion Role
            #region Propiedade
            CreateMap<Propiedade, PropiedadeDTO>().ReverseMap();
            #endregion Propiedade
            #region ImagenPropiedad
            CreateMap<ImagenesPropiedad,ImagenesPropiedadDTO>().ReverseMap();
            #endregion ImagenPropiedad
            #region DocuemntosUsuario
            CreateMap<DocumentosUsuario,DocumentosUsuarioDTO>().ReverseMap();
            #endregion DocumentosUsuario
            #region ContactosPropiedad
            CreateMap<ContactosPropiedad,ContactosPropiedadDTO>().ReverseMap();
            #endregion ContactosPropiedad


        }
    }
}
