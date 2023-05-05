using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Generics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace ManageMe.Infrastructure.Repositories;

public class ProjectRepository : Repository<ProjectEntity, ManageMeDbContext>, IProjectRepository
{
    public ProjectRepository(
        ManageMeDbContext dbContext,
        IMediator mediator,
        ILogger<Repository<ProjectEntity, ManageMeDbContext>> logger) 
        : base(dbContext, mediator, logger)
    {
        
    }
}