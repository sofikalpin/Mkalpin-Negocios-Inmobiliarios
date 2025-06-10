using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using MKalpinNI.IOC; // Make sure this project/assembly exists and is correctly referenced.

var builder = WebApplication.CreateBuilder(args);

// Configuración de Kestrel para escuchar en todos los IPs
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5228); // **CRITICAL CHECK:** Ensure port 5228 is not already in use.
                               // If it is, the application won't start.
                               // You can change this port (e.g., 5229) to test.
});

// Deshabilitar HTTPS Redirection
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = null; // This disables HTTPS redirection. Ensure you're accessing via HTTP.
});

// Inyección de dependencias
builder.Services.InyectarDependencias(builder.Configuration); // **CRITICAL CHECK:**
                                                              // 1. Is 'MKalpinNI.IOC' project building successfully?
                                                              // 2. Is this method correctly implemented and accessible?
                                                              // 3. Does it rely on any specific configuration (e.g., connection strings)
                                                              //    in appsettings.json that might be missing or malformed?
builder.Services.AddControllers();

// Configuración de CORS para permitir cualquier origen (en desarrollo)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Configuración para desarrollo
            policy.SetIsOriginAllowed(_ => true) // Allows any origin in development
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
        else
        {
            // Configuración para producción
            policy.WithOrigins("https://edumatch-three.vercel.app") // Specific origin for production
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});


// Agregar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar Swagger para todos los ambientes
// Swagger UI will be available at /swagger and /swagger/v1/swagger.json
app.UseSwagger();
app.UseSwaggerUI();

// Configuración de CORS
app.UseCors("AllowAllOrigins"); // **CRITICAL CHECK:** Ensure this middleware is placed correctly.
                                // It should be after UseRouting and before UseAuthorization/UseEndpoints.
                                // In this code, it's fine.

app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles(); // If you have static files (e.g., HTML, CSS, JS) in 'wwwroot', this serves them.

app.Run(); // Starts the application. If an error occurs before this, it will fail to start.