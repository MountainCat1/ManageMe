using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Generics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ManageMe.Infrastructure.Repositories;

public class LocalAccountRepository: Repository<LocalAccountEntity, ManageMeDbContext>, ILocalAccountRepository
{
    public LocalAccountRepository(ManageMeDbContext dbContext, IMediator mediator, ILogger<Repository<LocalAccountEntity, ManageMeDbContext>> logger) : base(dbContext, mediator, logger)
    {
    }
}