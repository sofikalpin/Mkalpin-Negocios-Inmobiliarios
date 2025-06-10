using AutoMapper;
using MKalpinNI.DTO;
using MKalpinNI.Model.DTOs;
using MKalpinNI.Model.Models;

namespace MKalpinNI.Utility
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Usuario, UsuarioDTO>()
                .ForMember(dest => dest.IdRol, opt => opt.MapFrom(src => src.IdRolNavigation));

            CreateMap<UsuarioDTO, Usuario>()
                .ForMember(dest => dest.IdRolNavigation, opt => opt.Ignore());

            CreateMap<Tasacione, TasacioneDTO>().ReverseMap();

            CreateMap<Role, RoleDTO>().ReverseMap();

            CreateMap<Propiedade, PropiedadDTO>()
                .ForMember(dest => dest.Propietario, opt => opt.MapFrom(src => src.IdPropietarioNavigation))
                .ForMember(dest => dest.Imagenes, opt => opt.MapFrom(src => src.ImagenesPropiedads))
                .ForMember(dest => dest.Contactos, opt => opt.MapFrom(src => src.ContactosPropiedads));

            CreateMap<PropiedadDTO, Propiedade>()
                .ForMember(dest => dest.IdPropietarioNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.ImagenesPropiedads, opt => opt.Ignore())
                .ForMember(dest => dest.ContactosPropiedads, opt => opt.Ignore());

            CreateMap<ImagenesPropiedad, ImagenesPropiedadDTO>().ReverseMap();

            CreateMap<DocumentosUsuario, DocumentosUsuarioDTO>().ReverseMap();

            CreateMap<ContactosPropiedad, ContactosPropiedadDTO>().ReverseMap();
        }
    }
}