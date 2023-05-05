using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Generics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ManageMe.Infrastructure.Repositories;

public class FunctionalityRepository :  Repository<FunctionalityEntity, ManageMeDbContext>, IFunctionalityRepository
{
    public FunctionalityRepository(ManageMeDbContext dbContext, IMediator mediator, ILogger<Repository<FunctionalityEntity, ManageMeDbContext>> logger) : base(dbContext, mediator, logger)
    {
    }
}