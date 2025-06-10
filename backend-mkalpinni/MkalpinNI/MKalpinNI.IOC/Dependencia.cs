using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MKalpinNI.Utility;
using MKalpinNI.DAL.Repositorios;
using MKalpinNI.DAL.Repositorios.Contrato;
using MKalpinNI.DAL.DBContext;
using MKalpinNI.Model.Models;

namespace MKalpinNI.IOC
{
    public static class Dependencia
    {
        public static void InyectarDependencias(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<MiDbContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("cadenaPostGreSQL");
                options.UseNpgsql(connectionString);
            });

            services.AddAutoMapper(typeof(AutoMapperProfile));
        }
    }
}

