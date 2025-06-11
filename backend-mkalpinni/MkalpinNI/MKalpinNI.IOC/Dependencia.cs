using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MKalpinNI.Utility;
using MKalpinNI.DAL.Repositorios;
using MKalpinNI.DAL.Repositorios.Contrato;
using MKalpinNI.DAL.DBContext;
using MKalpinNI.Model.Models;
using MkalpinN.BLL.Servicios.Contrato;
using MkalpinN.BLL.Servicios;

namespace MKalpinNI.IOC
{
    public static class Dependencia
    {
        public static void InyectarDependencias(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<MiDbContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("cadenaPost");
                options.UseNpgsql(connectionString);
            });

            services.AddAutoMapper(typeof(AutoMapperProfile));

            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IPropiedadService, PropiedadService>();
            services.AddScoped<IContactoPropiedadService, ContactoPropiedadService>();
            services.AddScoped<IDocumentosUsuarioService, DocumentosUsuarioService>();
            services.AddScoped<ITasacionService, TasacionService>();
            services.AddScoped<IImagenesPropiedadService, ImagenesPropiedadService>();

            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

        }
    }
}

