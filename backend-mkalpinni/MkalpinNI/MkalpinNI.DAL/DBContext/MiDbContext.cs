using System;
using System.Collections.Generic;
using MKalpinNI.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace MKalpinNI.DAL.DBContext
{

    public partial class MiDbContext : DbContext
    {
        public MiDbContext()
        {
        }

        public MiDbContext(DbContextOptions<MiDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ContactosPropiedad> ContactosPropiedads { get; set; }

        public virtual DbSet<DocumentosUsuario> DocumentosUsuarios { get; set; }

        public virtual DbSet<ImagenesPropiedad> ImagenesPropiedads { get; set; }

        public virtual DbSet<Propiedade> Propiedades { get; set; }

        public virtual DbSet<Role> Roles { get; set; }

        public virtual DbSet<Tasacione> Tasaciones { get; set; }

        public virtual DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ContactosPropiedad>(entity =>
            {
                entity.HasKey(e => e.IdContacto).HasName("ContactosPropiedad_pkey");

                entity.ToTable("ContactosPropiedad");

                entity.Property(e => e.IdContacto).HasColumnName("id_contacto");
                entity.Property(e => e.Correo)
                    .HasMaxLength(255)
                    .HasColumnName("correo");
                entity.Property(e => e.FechaContacto)
                    .HasDefaultValueSql("now()")
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("fecha_contacto");
                entity.Property(e => e.IdPropiedad).HasColumnName("id_propiedad");
                entity.Property(e => e.Mensaje).HasColumnName("mensaje");
                entity.Property(e => e.Nombre)
                    .HasMaxLength(100)
                    .HasColumnName("nombre");
                entity.Property(e => e.Telefono)
                    .HasMaxLength(20)
                    .HasColumnName("telefono");

                entity.HasOne(d => d.IdPropiedadNavigation).WithMany(p => p.ContactosPropiedads)
                    .HasForeignKey(d => d.IdPropiedad)
                    .HasConstraintName("fk_propiedad_contacto");
            });

            modelBuilder.Entity<DocumentosUsuario>(entity =>
            {
                entity.HasKey(e => e.IdDocumento).HasName("DocumentosUsuario_pkey");

                entity.ToTable("DocumentosUsuario");

                entity.Property(e => e.IdDocumento).HasColumnName("id_documento");
                entity.Property(e => e.FechaSubida)
                    .HasDefaultValueSql("now()")
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("fecha_subida");
                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
                entity.Property(e => e.NombreArchivo)
                    .HasMaxLength(255)
                    .HasColumnName("nombre_archivo");
                entity.Property(e => e.RutaArchivo)
                    .HasMaxLength(255)
                    .HasColumnName("ruta_archivo");
                entity.Property(e => e.TipoDocumento)
                    .HasMaxLength(100)
                    .HasColumnName("tipo_documento");

                entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.DocumentosUsuarios)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("fk_usuario_documento");
            });

            modelBuilder.Entity<ImagenesPropiedad>(entity =>
            {
                entity.HasKey(e => e.IdImagen).HasName("ImagenesPropiedad_pkey");

                entity.ToTable("ImagenesPropiedad");

                entity.Property(e => e.IdImagen).HasColumnName("id_imagen");
                entity.Property(e => e.EsPrincipal)
                    .HasDefaultValue(false)
                    .HasColumnName("es_principal");
                entity.Property(e => e.IdPropiedad).HasColumnName("id_propiedad");
                entity.Property(e => e.UrlImagen)
                    .HasMaxLength(255)
                    .HasColumnName("url_imagen");

                entity.HasOne(d => d.IdPropiedadNavigation).WithMany(p => p.ImagenesPropiedads)
                    .HasForeignKey(d => d.IdPropiedad)
                    .HasConstraintName("fk_propiedad_imagen");
            });

            modelBuilder.Entity<Propiedade>(entity =>
            {
                entity.HasKey(e => e.IdPropiedad).HasName("Propiedades_pkey");

                entity.HasIndex(e => e.Precio, "idx_propiedades_precio");

                entity.HasIndex(e => e.TipoPropiedad, "idx_propiedades_tipo");

                entity.HasIndex(e => e.TransaccionTipo, "idx_propiedades_transaccion");

                entity.HasIndex(e => new { e.Ubicacion, e.Barrio }, "idx_propiedades_ubicacion");

                entity.Property(e => e.IdPropiedad).HasColumnName("id_propiedad");
                entity.Property(e => e.AireAcondicionado)
                    .HasDefaultValue(false)
                    .HasColumnName("aire_acondicionado");
                entity.Property(e => e.AntiguedadAnios).HasColumnName("antiguedad_anios");
                entity.Property(e => e.Banos).HasColumnName("banos");
                entity.Property(e => e.Barrio)
                    .HasMaxLength(255)
                    .HasColumnName("barrio");
                entity.Property(e => e.CheckIn).HasColumnName("check_in");
                entity.Property(e => e.CheckOut).HasColumnName("check_out");
                entity.Property(e => e.CocinaEquipada)
                    .HasDefaultValue(false)
                    .HasColumnName("cocina_equipada");
                entity.Property(e => e.Descripcion).HasColumnName("descripcion");
                entity.Property(e => e.EsFavorito)
                    .HasDefaultValue(false)
                    .HasColumnName("es_favorito");
                entity.Property(e => e.Estacionamientos)
                    .HasDefaultValue(0)
                    .HasColumnName("estacionamientos");
                entity.Property(e => e.EstadoPropiedad)
                    .HasMaxLength(50)
                    .HasDefaultValueSql("'Disponible'::character varying")
                    .HasColumnName("estado_propiedad");
                entity.Property(e => e.Habitaciones).HasColumnName("habitaciones");
                entity.Property(e => e.HuespedesMax).HasColumnName("huespedes_max");
                entity.Property(e => e.IdPropietario).HasColumnName("id_propietario");
                entity.Property(e => e.Latitud)
                    .HasPrecision(10, 7)
                    .HasColumnName("latitud");
                entity.Property(e => e.Longitud)
                    .HasPrecision(10, 7)
                    .HasColumnName("longitud");
                entity.Property(e => e.Moneda)
                    .HasMaxLength(10)
                    .HasDefaultValueSql("'USD'::character varying")
                    .HasColumnName("moneda");
                entity.Property(e => e.Orientacion)
                    .HasMaxLength(50)
                    .HasColumnName("orientacion");
                entity.Property(e => e.Piscina)
                    .HasDefaultValue(false)
                    .HasColumnName("piscina");
                entity.Property(e => e.Precio)
                    .HasPrecision(18, 2)
                    .HasColumnName("precio");
                entity.Property(e => e.Seguridad24hs)
                    .HasDefaultValue(false)
                    .HasColumnName("seguridad_24hs");
                entity.Property(e => e.SuperficieM2)
                    .HasPrecision(10, 2)
                    .HasColumnName("superficie_m2");
                entity.Property(e => e.TipoPropiedad)
                    .HasMaxLength(50)
                    .HasColumnName("tipo_propiedad");
                entity.Property(e => e.Titulo)
                    .HasMaxLength(255)
                    .HasColumnName("titulo");
                entity.Property(e => e.TransaccionTipo)
                    .HasMaxLength(50)
                    .HasColumnName("transaccion_tipo");
                entity.Property(e => e.Ubicacion)
                    .HasMaxLength(255)
                    .HasColumnName("ubicacion");

                entity.HasOne(d => d.IdPropietarioNavigation).WithMany(p => p.Propiedades)
                    .HasForeignKey(d => d.IdPropietario)
                    .HasConstraintName("fk_propietario");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.IdRol).HasName("Roles_pkey");

                entity.HasIndex(e => e.NombreRol, "Roles_nombre_rol_key").IsUnique();

                entity.Property(e => e.IdRol).HasColumnName("id_rol");
                entity.Property(e => e.NombreRol)
                    .HasMaxLength(50)
                    .HasColumnName("nombre_rol");
            });

            modelBuilder.Entity<Tasacione>(entity =>
            {
                entity.HasKey(e => e.IdTasacion).HasName("Tasaciones_pkey");

                entity.Property(e => e.IdTasacion).HasColumnName("id_tasacion");
                entity.Property(e => e.AntiguedadAnios).HasColumnName("antiguedad_anios");
                entity.Property(e => e.Banos).HasColumnName("banos");
                entity.Property(e => e.CorreoContacto)
                    .HasMaxLength(255)
                    .HasColumnName("correo_contacto");
                entity.Property(e => e.DescripcionPropiedad).HasColumnName("descripcion_propiedad");
                entity.Property(e => e.Direccion)
                    .HasMaxLength(255)
                    .HasColumnName("direccion");
                entity.Property(e => e.EstadoPropiedad)
                    .HasMaxLength(50)
                    .HasColumnName("estado_propiedad");
                entity.Property(e => e.FechaSolicitud)
                    .HasDefaultValueSql("now()")
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("fecha_solicitud");
                entity.Property(e => e.Habitaciones).HasColumnName("habitaciones");
                entity.Property(e => e.MetrosCuadrados)
                    .HasPrecision(10, 2)
                    .HasColumnName("metros_cuadrados");
                entity.Property(e => e.NombreContacto)
                    .HasMaxLength(100)
                    .HasColumnName("nombre_contacto");
                entity.Property(e => e.TelefonoContacto)
                    .HasMaxLength(20)
                    .HasColumnName("telefono_contacto");
                entity.Property(e => e.TipoPropiedad)
                    .HasMaxLength(50)
                    .HasColumnName("tipo_propiedad");
                entity.Property(e => e.UbicacionTipo)
                    .HasMaxLength(50)
                    .HasColumnName("ubicacion_tipo");
                entity.Property(e => e.ValorEstimado)
                    .HasPrecision(18, 2)
                    .HasColumnName("valor_estimado");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario).HasName("Usuarios_pkey");

                entity.HasIndex(e => e.Correo, "Usuarios_correo_key").IsUnique();

                entity.HasIndex(e => e.Dni, "Usuarios_dni_key").IsUnique();

                entity.HasIndex(e => e.Correo, "idx_usuarios_correo");

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
                entity.Property(e => e.Apellido)
                    .HasMaxLength(100)
                    .HasColumnName("apellido");
                entity.Property(e => e.AutProf)
                    .HasDefaultValue(false)
                    .HasColumnName("aut_prof");
                entity.Property(e => e.ContrasenaHash)
                    .HasMaxLength(255)
                    .HasColumnName("contrasena_hash");
                entity.Property(e => e.Correo)
                    .HasMaxLength(255)
                    .HasColumnName("correo");
                entity.Property(e => e.Dni)
                    .HasMaxLength(20)
                    .HasColumnName("dni");
                entity.Property(e => e.FechaRegistro)
                    .HasDefaultValueSql("now()")
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("fecha_registro");
                entity.Property(e => e.FotoRuta)
                    .HasMaxLength(255)
                    .HasColumnName("foto_ruta");
                entity.Property(e => e.IdRol).HasColumnName("id_rol");
                entity.Property(e => e.Nombre)
                    .HasMaxLength(100)
                    .HasColumnName("nombre");
                entity.Property(e => e.Telefono)
                    .HasMaxLength(20)
                    .HasColumnName("telefono");
                entity.Property(e => e.TokenExpiracion)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("token_expiracion");
                entity.Property(e => e.TokenRecuperacion)
                    .HasMaxLength(255)
                    .HasColumnName("token_recuperacion");

                entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.IdRol)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("fk_rol");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}