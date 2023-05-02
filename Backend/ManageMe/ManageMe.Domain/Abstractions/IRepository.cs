using System.Linq.Expressions;
using ManageMe.Domain.Generics;

namespace ManageMe.Domain.Abstractions;


public interface IRepository
{
    
}
public interface IRepository<TEntity> : IRepository where TEntity : Entity
{
    public Task<TEntity?> GetOneAsync(params object[] keys);
    public Task<IEnumerable<TEntity>> GetAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params string[] includeProperties);
    public Task<TEntity?> GetOneAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[]? includeProperties);
    public Task<TEntity> GetOneRequiredAsync(params object[] keys);
    Task<TEntity> GetOneRequiredAsync(Expression<Func<TEntity, bool>>? filter = null,
        params string[]? includeProperties);
    public Task<ICollection<TEntity>> GetAllAsync();
    public Task DeleteAsync(params object[] keys);
    public Task<TEntity> AddAsync(TEntity entity);
    public Task<TEntity> UpdateAsync(object update, params object[] keys);
    public Task<Exception?> SaveChangesAsync();

    Task<PagedResult<TEntity>> GetPaginatedAsync(
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        int pageNumber = 1,
        int pageSize = 10,
        params string[] includeProperties);
}