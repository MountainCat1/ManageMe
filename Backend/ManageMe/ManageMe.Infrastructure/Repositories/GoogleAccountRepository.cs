using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Generics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ManageMe.Infrastructure.Repositories;

public class GoogleAccountRepository : Repository<GoogleAccountEntity, ManageMeDbContext>, IGoogleAccountRepository
{
    public GoogleAccountRepository(ManageMeDbContext dbContext, IMediator mediator, ILogger<Repository<GoogleAccountEntity, ManageMeDbContext>> logger) : base(dbContext, mediator, logger)
    {
    }
}