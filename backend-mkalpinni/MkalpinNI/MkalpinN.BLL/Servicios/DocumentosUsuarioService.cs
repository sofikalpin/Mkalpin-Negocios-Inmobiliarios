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
    public class DocumentosUsuarioService : IDocumentosUsuarioService
    {
        private readonly IGenericRepository<DocumentosUsuario> _documentoRepository;
        private readonly IMapper _mapper;

        public DocumentosUsuarioService(IGenericRepository<DocumentosUsuario> documentoRepository, IMapper mapper)
        {
            _documentoRepository = documentoRepository;
            _mapper = mapper;
        }

        public async Task<DocumentosUsuarioDTO> ObtenerPorId(int idDocumento)
        {
            try
            {
                var documentoEncontrado = await _documentoRepository.Obtener(d => d.IdDocumento == idDocumento);
                if (documentoEncontrado == null)
                {
                    throw new TaskCanceledException("Documento de usuario no encontrado.");
                }
                return _mapper.Map<DocumentosUsuarioDTO>(documentoEncontrado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el documento de usuario por ID.", ex);
            }
        }

        public async Task<List<DocumentosUsuarioDTO>> ObtenerTodos()
        {
            try
            {
                var listaDocumentos = await _documentoRepository.Consultar();
                return _mapper.Map<List<DocumentosUsuarioDTO>>(listaDocumentos);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de usuario.", ex);
            }
        }

        public async Task<List<DocumentosUsuarioDTO>> ObtenerPorIdUsuario(int idUsuario)
        {
            try
            {
                var listaDocumentos = await _documentoRepository.Consultar(d => d.IdUsuario == idUsuario);
                return _mapper.Map<List<DocumentosUsuarioDTO>>(listaDocumentos);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener documentos de usuario por ID de usuario.", ex);
            }
        }

        public async Task<DocumentosUsuarioDTO> Crear(DocumentosUsuarioDTO modelo)
        {
            try
            {
                var documentoCreado = await _documentoRepository.Crear(_mapper.Map<DocumentosUsuario>(modelo));
                if (documentoCreado.IdDocumento == 0) // Asumiendo que IdDocumento es autoincremental
                {
                    throw new TaskCanceledException("No se pudo crear el documento de usuario.");
                }
                return _mapper.Map<DocumentosUsuarioDTO>(documentoCreado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento de usuario.", ex);
            }
        }

        public async Task<bool> Eliminar(int idDocumento)
        {
            try
            {
                var documentoEncontrado = await _documentoRepository.Obtener(d => d.IdDocumento == idDocumento);
                if (documentoEncontrado == null)
                {
                    throw new TaskCanceledException("Documento de usuario no encontrado para eliminar.");
                }
                var resultado = await _documentoRepository.Eliminar(documentoEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el documento de usuario.", ex);
            }
        }
    }
}
