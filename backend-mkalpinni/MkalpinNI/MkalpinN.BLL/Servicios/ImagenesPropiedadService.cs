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

namespace MkalpinN.BLL.Servicios
{
    public class ImagenesPropiedadService : IImagenesPropiedadService
    {
        private readonly IGenericRepository<ImagenesPropiedad> _imagenesRepository;
        private readonly IMapper _mapper;

        public ImagenesPropiedadService(IGenericRepository<ImagenesPropiedad> imagenesRepository, IMapper mapper)
        {
            _imagenesRepository = imagenesRepository;
            _mapper = mapper;
        }

        public async Task<ImagenesPropiedadDTO> ObtenerPorId(int idImagen)
        {
            try
            {
                var imagenEncontrada = await _imagenesRepository.Obtener(i => i.IdImagen == idImagen);
                if (imagenEncontrada == null)
                {
                    throw new TaskCanceledException("Imagen de propiedad no encontrada.");
                }
                return _mapper.Map<ImagenesPropiedadDTO>(imagenEncontrada);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la imagen de propiedad por ID.", ex);
            }
        }

        public async Task<List<ImagenesPropiedadDTO>> ObtenerTodas()
        {
            try
            {
                var listaImagenes = await _imagenesRepository.Consultar();
                return _mapper.Map<List<ImagenesPropiedadDTO>>(listaImagenes);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todas las imágenes de propiedad.", ex);
            }
        }

        public async Task<List<ImagenesPropiedadDTO>> ObtenerPorIdPropiedad(int idPropiedad)
        {
            try
            {
                // Incluye la propiedad si necesitas sus datos relacionados
                var listaImagenes = await _imagenesRepository.Consultar(i => i.IdPropiedad == idPropiedad);
                                                          
                return _mapper.Map<List<ImagenesPropiedadDTO>>(listaImagenes);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener imágenes de propiedad por ID de propiedad.", ex);
            }
        }

        public async Task<ImagenesPropiedadDTO> Crear(ImagenesPropiedadDTO modelo)
        {
            try
            {
                var imagenCreada = await _imagenesRepository.Crear(_mapper.Map<ImagenesPropiedad>(modelo));
                if (imagenCreada.IdImagen == 0) // Asumiendo que IdImagen es autoincremental
                {
                    throw new TaskCanceledException("No se pudo crear la imagen de propiedad.");
                }
                return _mapper.Map<ImagenesPropiedadDTO>(imagenCreada);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la imagen de propiedad.", ex);
            }
        }

        public async Task<bool> Eliminar(int idImagen)
        {
            try
            {
                var imagenEncontrada = await _imagenesRepository.Obtener(i => i.IdImagen == idImagen);
                if (imagenEncontrada == null)
                {
                    throw new TaskCanceledException("Imagen de propiedad no encontrada para eliminar.");
                }
                var resultado = await _imagenesRepository.Eliminar(imagenEncontrada);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar la imagen de propiedad.", ex);
            }
        }
    }
}
