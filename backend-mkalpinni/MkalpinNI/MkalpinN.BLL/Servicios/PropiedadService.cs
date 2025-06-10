using AutoMapper;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.DAL.Repositorios.Contrato;
using MKalpinNI.DTO;
using MKalpinNI.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace MkalpinN.BLL.Servicios
{
    public class PropiedadService : IPropiedadService
    {
        private readonly IGenericRepository<Propiedade> _propiedadRepository;
        private readonly IMapper _mapper;

        public PropiedadService(IGenericRepository<Propiedade> propiedadRepository, IMapper mapper)
        {
            _propiedadRepository = propiedadRepository;
            _mapper = mapper;
        }

        public async Task<PropiedadeDTO> ObtenerPorId(int idPropiedad)
        {
            try
            {
                var queryPropiedad = await _propiedadRepository.Consultar(p => p.IdPropiedad == idPropiedad);

                var propiedadEncontrada = await queryPropiedad
                    .Include(p => p.IdPropietario)
                    .Include(p => p.TipoPropiedad)
                    .Include(p => p.EstadoPropiedad)
                    .Include(p => p.Barrio)
                    .FirstOrDefaultAsync();

                if (propiedadEncontrada == null)
                    throw new TaskCanceledException("Propiedad no encontrada");

                return _mapper.Map<PropiedadeDTO>(propiedadEncontrada);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener propiedad por ID.", ex);
            }
        }

        public async Task<PropiedadeDTO> Crear(PropiedadeDTO modelo)
        {
            try
            {
                var propiedadCreada = await _propiedadRepository.Crear(_mapper.Map<Propiedade>(modelo));

                if (propiedadCreada.IdPropiedad == 0)
                    throw new TaskCanceledException("No se pudo crear la propiedad");

                var queryPropiedadCreada = await _propiedadRepository.Consultar(p => p.IdPropiedad == propiedadCreada.IdPropiedad);

                var propiedadConRelaciones = await queryPropiedadCreada
                    .Include(p => p.IdPropietario)
                    .Include(p => p.TipoPropiedad)
                    .Include(p => p.EstadoPropiedad)
                    .Include(p => p.Barrio)
                    .FirstOrDefaultAsync();

                return _mapper.Map<PropiedadeDTO>(propiedadConRelaciones);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la propiedad.", ex);
            }
        }

        public async Task<bool> Editar(PropiedadeDTO modelo)
        {
            try
            {
                var propiedadEncontrada = await _propiedadRepository.Obtener(p => p.IdPropiedad == modelo.IdPropiedad);

                if (propiedadEncontrada == null)
                    throw new TaskCanceledException("Propiedad no encontrada para editar");

                // Actualizar propiedades básicas del DTO
                propiedadEncontrada.Titulo = modelo.Titulo;
                propiedadEncontrada.Precio = modelo.Precio;
                propiedadEncontrada.Descripcion = modelo.Descripcion;
                propiedadEncontrada.Latitud = modelo.Latitud;
                propiedadEncontrada.Longitud = modelo.Longitud;
                propiedadEncontrada.IdPropietario = modelo.IdPropietario;

                // Mapear propiedades con nombres diferentes
                propiedadEncontrada.Habitaciones = modelo.Habitaciones;
                propiedadEncontrada.Banos = modelo.Banos;
                propiedadEncontrada.SuperficieM2 = modelo.SuperficieM2;
                propiedadEncontrada.Ubicacion = modelo.Ubicacion;
                propiedadEncontrada.Estacionamientos = modelo.Estacionamientos;

                // Propiedades adicionales si existen en la entidad
                if (modelo.AntiguedadAnios.HasValue)
                    propiedadEncontrada.AntiguedadAnios = modelo.AntiguedadAnios;

                if (!string.IsNullOrEmpty(modelo.Orientacion))
                    propiedadEncontrada.Orientacion = modelo.Orientacion;

                if (modelo.AireAcondicionado.HasValue)
                    propiedadEncontrada.AireAcondicionado = modelo.AireAcondicionado;

                if (modelo.Piscina.HasValue)
                    propiedadEncontrada.Piscina = modelo.Piscina;

                if (modelo.Seguridad24hs.HasValue)
                    propiedadEncontrada.Seguridad24hs = modelo.Seguridad24hs;

                if (modelo.CocinaEquipada.HasValue)
                    propiedadEncontrada.CocinaEquipada = modelo.CocinaEquipada;

                if (modelo.HuespedesMax.HasValue)
                    propiedadEncontrada.HuespedesMax = modelo.HuespedesMax;

                if (modelo.CheckIn.HasValue)
                    propiedadEncontrada.CheckIn = modelo.CheckIn;

                if (modelo.CheckOut.HasValue)
                    propiedadEncontrada.CheckOut = modelo.CheckOut;

                // Nota: Para TipoPropiedad, EstadoPropiedad y Barrio necesitarás métodos helper
                // para convertir de string a ID si no usas AutoMapper para esto

                var resultado = await _propiedadRepository.Editar(propiedadEncontrada);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar la propiedad.", ex);
            }
        }

        public async Task<bool> Eliminar(int idPropiedad)
        {
            try
            {
                var propiedadEncontrada = await _propiedadRepository.Obtener(p => p.IdPropiedad == idPropiedad);
                if (propiedadEncontrada == null)
                    throw new TaskCanceledException("Propiedad no encontrada para eliminar");

                var resultado = await _propiedadRepository.Eliminar(propiedadEncontrada);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar la propiedad.", ex);
            }
        }

        public async Task<List<PropiedadeDTO>> ObtenerTodos()
        {
            try
            {
                var queryPropiedades = await _propiedadRepository.Consultar();

                var propiedades = await queryPropiedades
                    .Include(p => p.IdPropietario)
                    .Include(p => p.TipoPropiedad)
                    .Include(p => p.EstadoPropiedad)
                    .Include(p => p.Barrio)
                    .ToListAsync();

                return _mapper.Map<List<PropiedadeDTO>>(propiedades);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todas las propiedades.", ex);
            }
        }
    }
}