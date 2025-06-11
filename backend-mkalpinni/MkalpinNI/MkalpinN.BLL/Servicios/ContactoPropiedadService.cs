using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MKalpinNI.DAL.Repositorios.Contrato;
using MKalpinNI.DTO;
using MkalpinN.BLL.Servicios.Contrato;
using MKalpinNI.Model.Models;

namespace MkalpinN.BLL.Servicios
{
    public class ContactoPropiedadService : IContactoPropiedadService
    {
        private readonly IGenericRepository<ContactosPropiedad> _contactoRepository;
        private readonly IMapper _mapper;

        public ContactoPropiedadService(IGenericRepository<ContactosPropiedad> contactoRepository, IMapper mapper)
        {
            _contactoRepository = contactoRepository;
            _mapper = mapper;
        }

        public async Task<ContactosPropiedadDTO> ObtenerPorId(int idContacto)
        {
            try
            {
                var contactoEncontrado = await _contactoRepository.Obtener(c => c.IdContacto == idContacto);
                if (contactoEncontrado == null)
                {
                    throw new TaskCanceledException("Contacto no encontrado.");
                }
                return _mapper.Map<ContactosPropiedadDTO>(contactoEncontrado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el contacto por ID.", ex);
            }
        }

        public async Task<List<ContactosPropiedadDTO>> ObtenerTodos()
        {
            try
            {
                var listaContactos = await _contactoRepository.Consultar();
                return _mapper.Map<List<ContactosPropiedadDTO>>(listaContactos);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los contactos.", ex);
            }
        }

        public async Task<ContactosPropiedadDTO> Crear(ContactosPropiedadDTO modelo)
        {
            try
            {
                var contactoCreado = await _contactoRepository.Crear(_mapper.Map<ContactosPropiedad>(modelo));
                if (contactoCreado.IdContacto == 0)
                {
                    throw new TaskCanceledException("No se pudo crear el contacto.");
                }
                return _mapper.Map<ContactosPropiedadDTO>(contactoCreado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el contacto.", ex);
            }
        }

        public async Task<bool> Editar(ContactosPropiedadDTO modelo) // ¡Método Implementado!
        {
            try
            {
                var contactoModelo = _mapper.Map<ContactosPropiedad>(modelo);
                var contactoEncontrado = await _contactoRepository.Obtener(c => c.IdContacto == contactoModelo.IdContacto);

                if (contactoEncontrado == null)
                {
                    throw new TaskCanceledException("Contacto no encontrado para editar.");
                }

                // Actualizar las propiedades del contacto encontrado con los valores del modelo DTO
                contactoEncontrado.Nombre = contactoModelo.Nombre;
                contactoEncontrado.Correo = contactoModelo.Correo;
                contactoEncontrado.Telefono = contactoModelo.Telefono;
                contactoEncontrado.Mensaje = contactoModelo.Mensaje;
                contactoEncontrado.FechaContacto = contactoModelo.FechaContacto; // O manejar si no debe ser editable
                contactoEncontrado.IdPropiedad = contactoModelo.IdPropiedad; // Asegúrate de que esto es lo que quieres editar

                var resultado = await _contactoRepository.Editar(contactoEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar el contacto.", ex);
            }
        }

        public async Task<bool> Eliminar(int idContacto)
        {
            try
            {
                var contactoEncontrado = await _contactoRepository.Obtener(c => c.IdContacto == idContacto);
                if (contactoEncontrado == null)
                {
                    throw new TaskCanceledException("Contacto no encontrado para eliminar.");
                }
                var resultado = await _contactoRepository.Eliminar(contactoEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el contacto.", ex);
            }
        }

        public async Task<List<ContactosPropiedadDTO>> BuscarPorEmailOPropiedad(string email, int? idPropiedad)
        {
            try
            {
                var contactosQuery = await _contactoRepository.Consultar();

                if (!string.IsNullOrEmpty(email))
                {
                    contactosQuery = contactosQuery.Where(c => c.Correo.Contains(email));
                }

                if (idPropiedad.HasValue && idPropiedad.Value > 0)
                {
                    contactosQuery = contactosQuery.Where(c => c.IdPropiedad == idPropiedad.Value);
                }

                var listaResultado = await contactosQuery.ToListAsync();
                return _mapper.Map<List<ContactosPropiedadDTO>>(listaResultado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al buscar contactos.", ex);
            }
        }
    }
}