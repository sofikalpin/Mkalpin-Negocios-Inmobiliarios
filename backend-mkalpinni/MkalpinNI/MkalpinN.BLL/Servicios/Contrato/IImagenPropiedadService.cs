using MKalpinNI.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MkalpinN.BLL.Servicios.Contrato
{
    public interface IImagenesPropiedadService
    {
        Task<ImagenesPropiedadDTO> ObtenerPorId(int idImagen);
        Task<List<ImagenesPropiedadDTO>> ObtenerTodas();
        Task<List<ImagenesPropiedadDTO>> ObtenerPorIdPropiedad(int idPropiedad); // Método específico
        Task<ImagenesPropiedadDTO> Crear(ImagenesPropiedadDTO modelo);
        Task<bool> Eliminar(int idImagen);
    }
}
