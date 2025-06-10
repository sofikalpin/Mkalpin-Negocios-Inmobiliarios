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
    public class RoleService : IRoleService

    {
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IMapper _mapper;

        public RoleService(IGenericRepository<Role> roleRepository, IMapper mapper)
        {
            _roleRepository = roleRepository;
            _mapper = mapper;
        }

        public async Task<RoleDTO> ObtenerPorId(int idRol)
        {
            try
            {
                var roleEncontrado = await _roleRepository.Obtener(r => r.IdRol == idRol);
                if (roleEncontrado == null)
                {
                    throw new TaskCanceledException("Rol no encontrado.");
                }
                return _mapper.Map<RoleDTO>(roleEncontrado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el rol por ID.", ex);
            }
        }

        public async Task<List<RoleDTO>> ObtenerTodos()
        {
            try
            {
                var listaRoles = await _roleRepository.Consultar();
                return _mapper.Map<List<RoleDTO>>(listaRoles);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los roles.", ex);
            }
        }

        public async Task<RoleDTO> Crear(RoleDTO modelo)
        {
            try
            {
                var roleCreado = await _roleRepository.Crear(_mapper.Map<Role>(modelo));
                if (roleCreado.IdRol == 0) // Asumiendo que IdRol es autoincremental
                {
                    throw new TaskCanceledException("No se pudo crear el rol.");
                }
                return _mapper.Map<RoleDTO>(roleCreado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el rol.", ex);
            }
        }

        public async Task<bool> Editar(RoleDTO modelo)
        {
            try
            {
                var roleModelo = _mapper.Map<Role>(modelo);
                var roleEncontrado = await _roleRepository.Obtener(r => r.IdRol == roleModelo.IdRol);

                if (roleEncontrado == null)
                {
                    throw new TaskCanceledException("Rol no encontrado para editar.");
                }

                roleEncontrado.NombreRol = roleModelo.NombreRol;
              

                var resultado = await _roleRepository.Editar(roleEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar el rol.", ex);
            }
        }

        public async Task<bool> Eliminar(int idRol)
        {
            try
            {
                var roleEncontrado = await _roleRepository.Obtener(r => r.IdRol == idRol);
                if (roleEncontrado == null)
                {
                    throw new TaskCanceledException("Rol no encontrado para eliminar.");
                }
                var resultado = await _roleRepository.Eliminar(roleEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el rol.", ex);
            }
        }
    }
}
