using ManageMe.Domain.Abstractions;
using ManageMe.Domain.Entities;

namespace ManageMe.Domain.Repositories;

public interface IAccountRepository : IRepository<AccountEntity>
{
    public Task<AccountEntity?> GetAccountByEmailAsync(string email);
    public Task<AccountEntity?> GetWithRoleAsync(Guid id);
}