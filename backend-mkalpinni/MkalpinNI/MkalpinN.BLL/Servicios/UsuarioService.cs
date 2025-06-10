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
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;

namespace MkalpinN.BLL.Servicios
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IGenericRepository<Usuario> _usuarioRepository;
        private readonly IMapper _mapper;

        public UsuarioService(IGenericRepository<Usuario> usuarioRepository, IMapper mapper)
        {
            _usuarioRepository = usuarioRepository;
            _mapper = mapper;
        }

        public async Task<UsuarioDTO> ObtenerPorId(int idUsuario)
        {
            try
            {
                // Primero, obtén el IQueryable<Usuario> esperando la tarea
                var queryUsuario = await _usuarioRepository.Consultar(u => u.IdUsuario == idUsuario);

                // Luego, aplica Include y FirstOrDefaultAsync al IQueryable
                var usuarioEncontrado = await queryUsuario.Include(u => u.IdRolNavigation)
                                                          .FirstOrDefaultAsync();

                if (usuarioEncontrado == null)
                    throw new TaskCanceledException("Usuario no encontrado");

                return _mapper.Map<UsuarioDTO>(usuarioEncontrado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener usuario por ID.", ex);
            }
            }

        public async Task<List<UsuarioDTO>> ObtenerTodos()
        {
            try
            {
                // Primero, obtén el IQueryable<Usuario> esperando la tarea
                var queryUsuarios = await _usuarioRepository.Consultar();

                // Luego, aplica Include y ToListAsync al IQueryable
                var listaUsuarios = await queryUsuarios.Include(u => u.IdRolNavigation)
                                                       .ToListAsync();
                return _mapper.Map<List<UsuarioDTO>>(listaUsuarios);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los usuarios.", ex);
            }
        }

        public async Task<UsuarioDTO> Crear(UsuarioDTO modelo)
        {
            try
            {
                modelo.ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(modelo.ContrasenaHash);

                var usuarioCreado = await _usuarioRepository.Crear(_mapper.Map<Usuario>(modelo));
                if (usuarioCreado.IdUsuario == 0)
                    throw new TaskCanceledException("No se pudo crear el usuario");

                // Primero, obtén el IQueryable<Usuario> esperando la tarea
                var queryUsuarioConRol = await _usuarioRepository.Consultar(u => u.IdUsuario == usuarioCreado.IdUsuario);

                // Luego, aplica Include y FirstOrDefaultAsync al IQueryable
                var usuarioConRol = await queryUsuarioConRol.Include(u => u.IdRolNavigation)
                                                            .FirstOrDefaultAsync();

                return _mapper.Map<UsuarioDTO>(usuarioConRol);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el usuario.", ex);
            }
        }

        public async Task<bool> Editar(UsuarioDTO modelo)
        {
            try
            {
                var usuarioModelo = _mapper.Map<Usuario>(modelo);
                var usuarioEncontrado = await _usuarioRepository.Obtener(u => u.IdUsuario == usuarioModelo.IdUsuario);

                if (usuarioEncontrado == null)
                    throw new TaskCanceledException("Usuario no encontrado para editar");

                usuarioEncontrado.Nombre = usuarioModelo.Nombre;
                usuarioEncontrado.Apellido = usuarioModelo.Apellido;
                usuarioEncontrado.Correo = usuarioModelo.Correo;
                usuarioEncontrado.IdRol = usuarioModelo.IdRol;
                usuarioEncontrado.Telefono = usuarioModelo.Telefono;
                usuarioEncontrado.Dni = usuarioModelo.Dni;
                usuarioEncontrado.IdRol = usuarioModelo.IdRol;
                usuarioEncontrado.FechaRegistro = usuarioModelo.FechaRegistro;
                usuarioEncontrado.AutProf = usuarioModelo.AutProf;
                usuarioEncontrado.FotoRuta = usuarioModelo.FotoRuta;


                var resultado = await _usuarioRepository.Editar(usuarioEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al editar el usuario.", ex);
            }
        }

        public async Task<bool> Eliminar(int idUsuario)
        {
            try
            {
                var usuarioEncontrado = await _usuarioRepository.Obtener(u => u.IdUsuario == idUsuario);
                if (usuarioEncontrado == null)
                    throw new TaskCanceledException("Usuario no encontrado para eliminar");
                var resultado = await _usuarioRepository.Eliminar(usuarioEncontrado);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al eliminar el usuario.", ex);
            }
        }

        public async Task<UsuarioDTO> IniciarSesion(string correo, string clave)
        {
            try
            {
                // Primero, obtén el IQueryable<Usuario> esperando la tarea
                var queryUsuario = await _usuarioRepository.Consultar(u => u.Correo == correo);

                // Luego, aplica Include y FirstOrDefaultAsync al IQueryable
                var usuarioEncontrado = await queryUsuario.Include(u => u.IdRolNavigation)
                                                          .FirstOrDefaultAsync();

                if (usuarioEncontrado == null)
                {
                    throw new TaskCanceledException("Credenciales inválidas"); // Usuario no encontrado
                }

                // VERIFICAR LA CONTRASEÑA HASHEADA
                bool passwordCorrecta = BCrypt.Net.BCrypt.Verify(clave, usuarioEncontrado.ContrasenaHash);

                if (!passwordCorrecta)
                {
                    throw new TaskCanceledException("Credenciales inválidas"); // Contraseña incorrecta
                }

                return _mapper.Map<UsuarioDTO>(usuarioEncontrado);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al iniciar sesión. Verifique sus credenciales.", ex);
            }
        }
    }
}
