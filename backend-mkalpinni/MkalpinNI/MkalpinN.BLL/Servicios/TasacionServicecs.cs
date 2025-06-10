using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MKalpinNI.DAL.Repositorios.Contrato;
using MKalpinNI.DTO;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.Model.Models;

namespace MkalpinN.BLL.Servicios
{
    public class TasacionService : ITasacionService
    {
        private readonly IGenericRepository<Tasacione> _tasacionRepository;
        private readonly IMapper _mapper;

        public TasacionService(IGenericRepository<Tasacione> tasacionRepository, IMapper mapper)
        {
            _tasacionRepository = tasacionRepository;
            _mapper = mapper;
        }

        public async Task<TasacioneDTO> ObtenerPorId(int idTasacion)
        {
            try
            {
                var tasacionEncontrada = await _tasacionRepository.Obtener(t => t.IdTasacion == idTasacion);
                if (tasacionEncontrada == null)
                {
                    throw new TaskCanceledException("Tasación no encontrada.");
                }
                return _mapper.Map<TasacioneDTO>(tasacionEncontrada);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la tasación por ID.", ex);
            }
        }

        public async Task<List<TasacioneDTO>> ObtenerTodas()
        {
            try
            {
                var listaTasaciones = await _tasacionRepository.Consultar();
                return _mapper.Map<List<TasacioneDTO>>(listaTasaciones);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todas las tasaciones.", ex);
            }
        }

        public async Task<TasacioneDTO> Crear(TasacioneDTO modelo)
        {
            try
            {
                var tasacionCreada = await _tasacionRepository.Crear(_mapper.Map<Tasacione>(modelo));
                if (tasacionCreada.IdTasacion == 0)
                {
                    throw new TaskCanceledException("No se pudo crear la tasación.");
                }
                return _mapper.Map<TasacioneDTO>(tasacionCreada);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la tasación.", ex);
            }
        }

        public async Task<bool> Editar(TasacioneDTO modelo)
        {
            try
            {
                var tasacionModelo = _mapper.Map<Tasacione>(modelo);
                var tasacionEncontrada = await _tasacionRepository.Obtener(t => t.IdTasacion == tasacionModelo.IdTasacion);

                if (tasacionEncontrada == null)
                {
                    throw new TaskCanceledException("Tasación no encontrada para editar.");
                }

                // Actualiza las propiedades relevantes
                tasacionEncontrada.Direccion = tasacionModelo.Direccion;
                tasacionEncontrada.MetrosCuadrados = tasacionModelo.MetrosCuadrados;
                tasacionEncontrada.Habitaciones = tasacionModelo.Habitaciones;
                tasacionEncontrada.Banos = tasacionModelo.Banos;
                tasacionEncontrada.AntiguedadAnios = tasacionModelo.AntiguedadAnios;
                tasacionEncontrada.DescripcionPropiedad = tasacionModelo.DescripcionPropiedad;
                tasacionEncontrada.TipoPropiedad = tasacionModelo.TipoPropiedad;
                tasacionEncontrada.EstadoPropiedad = tasacionModelo.EstadoPropiedad;
                tasacionEncontrada.UbicacionTipo = tasacionModelo.UbicacionTipo;
                tasacionEncontrada.NombreContacto = tasacionModelo.NombreContacto;
                tasacionEncontrada.TelefonoContacto = tasacionModelo.TelefonoContacto;
                tasacionEncontrada.CorreoContacto = tasacionModelo.CorreoContacto;
                tasacionEncontrada.ValorEstimado = tasacionModelo.ValorEstimado;
                tasacionEncontrada.FechaSolicitud = tasacionModelo.FechaSolicitud;
                // Agrega más propiedades que necesites actualizar

                var resultado = await _tasacionRepository.Editar(tasacionEncontrada);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar la tasación.", ex);
            }
        }

        public async Task<bool> Eliminar(int idTasacion)
        {
            try
            {
                var tasacionEncontrada = await _tasacionRepository.Obtener(t => t.IdTasacion == idTasacion);
                if (tasacionEncontrada == null)
                {
                    throw new TaskCanceledException("Tasación no encontrada para eliminar.");
                }
                var resultado = await _tasacionRepository.Eliminar(tasacionEncontrada);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar la tasación.", ex);
            }
        }

        public async Task<List<TasacioneDTO>> BuscarPorCriterio(string criterio)
        {
            try
            {
                var tasacionQuery = await _tasacionRepository.Consultar();


                if (!string.IsNullOrEmpty(criterio))
                {
                    // Puedes buscar por diferentes campos, ajusta según tus necesidades
                    tasacionQuery = tasacionQuery.Where(t =>
                        t.Direccion.Contains(criterio)
                    );
                }

                var listaResultado = await tasacionQuery.ToListAsync();
                return _mapper.Map<List<TasacioneDTO>>(listaResultado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al buscar tasaciones por criterio.", ex);
            }
        }
    }
}