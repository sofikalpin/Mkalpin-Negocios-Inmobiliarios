using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using MKalpinNI.DAL.DBContext;



namespace MKalpinNI.DAL.Repositorios.Contrato
{
    public class GenericRepository<TModel> : IGenericRepository<TModel> where TModel : class
    {
        public readonly MiDbContext _dbContext;

        public GenericRepository(MiDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TModel> Obtener(Expression<Func<TModel, bool>> filtro)
        {
            try
            {
                TModel modelo = await _dbContext.Set<TModel>().FirstOrDefaultAsync(filtro);
                return modelo;

            }
            catch
            {
                throw;
            }
        }

        public async Task<TModel> Crear(TModel modelo)
        {
            try
            {
                await _dbContext.Set<TModel>().AddAsync(modelo);
                await _dbContext.SaveChangesAsync();
                return modelo;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(TModel modelo)
        {
            try
            {
                _dbContext.Set<TModel>().Update(modelo);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(TModel modelo)
        {
            try
            {
                _dbContext.Set<TModel>().Remove(modelo);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<IQueryable<TModel>> Consultar(Expression<Func<TModel, bool>>? filtro = null)
        {
            try
            {
                IQueryable<TModel> queryModelo = filtro == null ? _dbContext.Set<TModel>() : _dbContext.Set<TModel>().Where(filtro);

                return queryModelo;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<TModel>> ObtenerTodos(Expression<Func<TModel, bool>> filtro)
        {
            return await _dbContext.Set<TModel>().Where(filtro).ToListAsync();
        }

    }
}
