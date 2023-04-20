using ManageMe.Domain.Abstractions;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Generics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ManageMe.Infrastructure.Repositories;

public class AccountRepository : Repository<AccountEntity, ManageMeDbContext>, IAccountRepository
{
    public AccountRepository(ManageMeDbContext dbContext, IMediator mediator, ILogger<Repository<AccountEntity, ManageMeDbContext>> logger) : base(dbContext, mediator, logger)
    {
    }

    public async Task<AccountEntity?> GetAccountByEmailAsync(string email)
    {
        return await GetOneAsync(x => x.Email == email);
    }
}