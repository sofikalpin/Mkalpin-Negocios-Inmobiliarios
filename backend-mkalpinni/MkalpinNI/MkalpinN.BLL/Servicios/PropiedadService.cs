using AutoMapper;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.DAL.Repositorios.Contrato;
using MKalpinNI.Model.DTOs;
using MKalpinNI.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace MkalpinN.BLL.Servicios
{
    public class PropiedadService : IPropiedadService
    {
        private readonly IGenericRepository<Propiedade> _propiedadRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<PropiedadService> _logger;

        public PropiedadService(
            IGenericRepository<Propiedade> propiedadRepository,
            IMapper mapper,
            ILogger<PropiedadService> logger)
        {
            _propiedadRepository = propiedadRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PropiedadDTO> ObtenerPorId(int idPropiedad)
        {
            try
            {
                _logger.LogInformation("Obteniendo propiedad con ID: {IdPropiedad}", idPropiedad);

                var queryPropiedad = await _propiedadRepository.Consultar(p => p.IdPropiedad == idPropiedad);

                var propiedadEncontrada = await queryPropiedad
                    .Include(p => p.IdPropietarioNavigation)
                    .Include(p => p.ImagenesPropiedads)
                    .Include(p => p.ContactosPropiedads)
                    .FirstOrDefaultAsync();

                if (propiedadEncontrada == null)
                {
                    _logger.LogWarning("Propiedad con ID {IdPropiedad} no encontrada", idPropiedad);
                    throw new KeyNotFoundException($"Propiedad con ID {idPropiedad} no encontrada");
                }

                _logger.LogInformation("Propiedad con ID {IdPropiedad} obtenida exitosamente", idPropiedad);
                return _mapper.Map<PropiedadDTO>(propiedadEncontrada);
            }
            catch (KeyNotFoundException)
            {
                throw; // Re-lanza para que el controlador la maneje con un 404
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener propiedad con ID: {IdPropiedad}", idPropiedad);
                throw new InvalidOperationException("Error al obtener propiedad por ID.", ex);
            }
        }

        public async Task<List<PropiedadDTO>> ObtenerTodos()
        {
            try
            {
                _logger.LogInformation("Obteniendo todas las propiedades");

                var queryPropiedades = await _propiedadRepository.Consultar();

                var propiedades = await queryPropiedades
                    .Include(p => p.IdPropietarioNavigation)
                    .Include(p => p.ImagenesPropiedads)
                    .Include(p => p.ContactosPropiedads)
                    .OrderByDescending(p => p.IdPropiedad) // Ordenar por más recientes
                    .ToListAsync();

                _logger.LogInformation("Se obtuvieron {Count} propiedades", propiedades.Count);
                return _mapper.Map<List<PropiedadDTO>>(propiedades);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todas las propiedades");
                throw new InvalidOperationException("Error al obtener todas las propiedades.", ex);
            }
        }

        public async Task<List<PropiedadDTO>> BuscarPorCriterios(
            string? ubicacion = null,
            string? barrio = null,
            decimal? precioMin = null,
            decimal? precioMax = null,
            int? habitacionesMin = null,
            string? tipoPropiedad = null,
            string? transaccionTipo = null)
        {
            try
            {
                _logger.LogInformation("Buscando propiedades con criterios específicos");

                var query = await _propiedadRepository.Consultar();

                // Aplicar filtros con comprobaciones de nulidad y comparaciones que no distinguen entre mayúsculas y minúsculas
                if (!string.IsNullOrWhiteSpace(ubicacion))
                {
                    query = query.Where(p => EF.Functions.Like(p.Ubicacion.ToLower(), $"%{ubicacion.ToLower()}%"));
                }

                if (!string.IsNullOrWhiteSpace(barrio))
                {
                    query = query.Where(p => EF.Functions.Like(p.Barrio.ToLower(), $"%{barrio.ToLower()}%"));
                }

                if (precioMin.HasValue && precioMin.Value > 0)
                {
                    query = query.Where(p => p.Precio >= precioMin.Value);
                }

                if (precioMax.HasValue && precioMax.Value > 0)
                {
                    query = query.Where(p => p.Precio <= precioMax.Value);
                }

                if (habitacionesMin.HasValue && habitacionesMin.Value > 0)
                {
                    query = query.Where(p => p.Habitaciones >= habitacionesMin.Value);
                }

                if (!string.IsNullOrWhiteSpace(tipoPropiedad))
                {
                    query = query.Where(p => p.TipoPropiedad.ToLower() == tipoPropiedad.ToLower());
                }

                if (!string.IsNullOrWhiteSpace(transaccionTipo))
                {
                    query = query.Where(p => p.TransaccionTipo.ToLower() == transaccionTipo.ToLower());
                }

                var propiedades = await query
                    .Include(p => p.IdPropietarioNavigation)
                    .Include(p => p.ImagenesPropiedads)
                    .Include(p => p.ContactosPropiedads)
                    .OrderByDescending(p => p.IdPropiedad)
                    .ToListAsync();

                _logger.LogInformation("Se encontraron {Count} propiedades con los criterios especificados", propiedades.Count);
                return _mapper.Map<List<PropiedadDTO>>(propiedades);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar propiedades por criterios");
                throw new InvalidOperationException("Error al buscar propiedades por criterios.", ex);
            }
        }

        public async Task<List<PropiedadDTO>> ObtenerPorPropietario(int idPropietario)
        {
            try
            {
                _logger.LogInformation("Obteniendo propiedades del propietario con ID: {IdPropietario}", idPropietario);

                if (idPropietario <= 0)
                    throw new ArgumentException("El ID del propietario debe ser mayor a 0");

                var queryPropiedades = await _propiedadRepository.Consultar(p => p.IdPropietario == idPropietario);

                var propiedades = await queryPropiedades
                    .Include(p => p.IdPropietarioNavigation)
                    .Include(p => p.ImagenesPropiedads)
                    .Include(p => p.ContactosPropiedads)
                    .OrderByDescending(p => p.IdPropiedad)
                    .ToListAsync();

                _logger.LogInformation("Se obtuvieron {Count} propiedades del propietario {IdPropietario}",
                    propiedades.Count, idPropietario);

                return _mapper.Map<List<PropiedadDTO>>(propiedades);
            }
            catch (ArgumentException)
            {
                throw; // Re-lanza las excepciones de validación
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener propiedades del propietario con ID: {IdPropietario}", idPropietario);
                throw new InvalidOperationException("Error al obtener propiedades por propietario.", ex);
            }
        }

        public async Task<PropiedadDTO> Crear(PropiedadDTO modelo)
        {
            try
            {
                _logger.LogInformation("Intentando crear una nueva propiedad.");

                // Validaciones adicionales
                if (string.IsNullOrWhiteSpace(modelo.Titulo))
                    throw new ArgumentException("El título de la propiedad es requerido.");

                if (modelo.Precio <= 0)
                    throw new ArgumentException("El precio de la propiedad debe ser mayor a 0.");

                // Mapear el DTO a la entidad del modelo
                var propiedad = _mapper.Map<Propiedade>(modelo);

                // Crear la propiedad en el repositorio
                var propiedadCreada = await _propiedadRepository.Crear(propiedad);

                if (propiedadCreada == null)
                {
                    _logger.LogError("No se pudo crear la propiedad.");
                    throw new InvalidOperationException("No se pudo crear la propiedad.");
                }

                _logger.LogInformation("Propiedad creada exitosamente con ID: {IdPropiedad}", propiedadCreada.IdPropiedad);

                // Mapear la entidad creada de nuevo a DTO para devolverla
                return _mapper.Map<PropiedadDTO>(propiedadCreada);
            }
            catch (ArgumentException)
            {
                throw; // Re-lanza las excepciones de validación
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la propiedad.");
                throw new InvalidOperationException("Error al crear la propiedad.", ex);
            }
        }

        public async Task<bool> Editar(PropiedadDTO modelo)
        {
            try
            {
                _logger.LogInformation("Editando propiedad con ID: {IdPropiedad}", modelo.IdPropiedad);

                // Validaciones adicionales
                if (modelo.IdPropiedad <= 0)
                    throw new ArgumentException("El ID de la propiedad debe ser mayor a 0");

                if (string.IsNullOrWhiteSpace(modelo.Titulo))
                    throw new ArgumentException("El título de la propiedad es requerido");

                if (modelo.Precio <= 0)
                    throw new ArgumentException("El precio debe ser mayor a 0");

                var propiedadEncontrada = await _propiedadRepository.Obtener(p => p.IdPropiedad == modelo.IdPropiedad);

                if (propiedadEncontrada == null)
                {
                    _logger.LogWarning("Propiedad con ID {IdPropiedad} no encontrada para editar", modelo.IdPropiedad);
                    throw new KeyNotFoundException($"Propiedad con ID {modelo.IdPropiedad} no encontrada para editar");
                }

                _mapper.Map(modelo, propiedadEncontrada);

                var resultado = await _propiedadRepository.Editar(propiedadEncontrada);

                _logger.LogInformation("Propiedad con ID {IdPropiedad} editada exitosamente", modelo.IdPropiedad);
                return resultado;
            }
            catch (ArgumentException)
            {
                throw; // Re-lanza las excepciones de validación
            }
            catch (KeyNotFoundException)
            {
                throw; // Re-lanza para que el controlador la maneje con un 404
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al editar la propiedad con ID: {IdPropiedad}", modelo.IdPropiedad);
                throw new InvalidOperationException("Error al editar la propiedad.", ex);
            }
        }

        public async Task<bool> Eliminar(int idPropiedad)
        {
            try
            {
                _logger.LogInformation("Eliminando propiedad con ID: {IdPropiedad}", idPropiedad);

                if (idPropiedad <= 0)
                    throw new ArgumentException("El ID de la propiedad debe ser mayor a 0");

                var propiedadEncontrada = await _propiedadRepository.Obtener(p => p.IdPropiedad == idPropiedad);

                if (propiedadEncontrada == null)
                {
                    _logger.LogWarning("Propiedad con ID {IdPropiedad} no encontrada para eliminar", idPropiedad);
                    throw new KeyNotFoundException($"Propiedad con ID {idPropiedad} no encontrada para eliminar");
                }

                var resultado = await _propiedadRepository.Eliminar(propiedadEncontrada);

                _logger.LogInformation("Propiedad con ID {IdPropiedad} eliminada exitosamente", idPropiedad);
                return resultado;
            }
            catch (ArgumentException)
            {
                throw; // Re-lanza las excepciones de validación
            }
            catch (KeyNotFoundException)
            {
                throw; // Re-lanza para que el controlador la maneje con un 404
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar la propiedad con ID: {IdPropiedad}", idPropiedad);
                throw new InvalidOperationException("Error al eliminar la propiedad.", ex);
            }
        }
    }
}