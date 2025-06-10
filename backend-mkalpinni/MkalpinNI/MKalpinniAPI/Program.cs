using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using FluentValidation;
using FluentValidation.AspNetCore;
using SistemaApoyo.BLL.Validaciones;
using SistemaApoyo.BLL.Hubs;
using SistemaApoyo.IOC;
using MKalpinNI.IOC;

var builder = WebApplication.CreateBuilder(args);

// Configuraci�n de Kestrel para escuchar en todos los IPs
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5228);
});

// Deshabilitar HTTPS Redirection
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = null;
});

// Inyecci�n de dependencias
builder.Services.InyectarDependencias(builder.Configuration);
builder.Services.AddControllers();

// Configuraci�n de CORS para permitir cualquier origen (en desarrollo)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Configuraci�n para desarrollo
            policy.SetIsOriginAllowed(_ => true)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
        else
        {
            // Configuraci�n para producci�n
            policy.WithOrigins("https://edumatch-three.vercel.app")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

// Configuraci�n de Fluent Validation
builder.Services.AddFluentValidationAutoValidation();

// Registro de validadores
var validatorTypes = new[]
{
    typeof(ActividadValidator),
    typeof(ArticuloValidator),
    typeof(ChatValidator),
    typeof(ConsultaValidator),
    typeof(ExamenValidator),
    typeof(ForoValidator),
    typeof(LoginValidator),
    typeof(MensajeValidator),
    typeof(RespuestaValidator),
    typeof(SesionValidator),
    typeof(UsuarioValidator)
};

foreach (var validatorType in validatorTypes)
{
    builder.Services.AddValidatorsFromAssemblyContaining(validatorType);
}

// Agregar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar Swagger para todos los ambientes
app.UseSwagger();
app.UseSwaggerUI();

// Configuraci�n de CORS
app.UseCors("AllowAllOrigins");

app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();



app.Run();