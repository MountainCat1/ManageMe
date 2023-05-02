using Catut;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using MediatR;

namespace ManageMe.Application.Features.Project;

public class CreateProjectRequest : IRequest<Result>
{
    public required string Name { get; set; }
    public required string Description { get; set; }
}

public class CreateProjectRequestHandler : IRequestHandler<CreateProjectRequest, Result>
{
    private IProjectRepository _projectRepository;

    public CreateProjectRequestHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public Task<Result> Handle(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        return ProjectEntity.Create(request.Name, request.Description, DateTime.Now)
            .BindAsync(SaveToTheDatabase)
            .BindAsync(_ => Result.SuccessTask());
    }

    private async Task<Result<ProjectEntity>> SaveToTheDatabase(ProjectEntity entity)
    {
        await _projectRepository.AddAsync(entity);
        
        await _projectRepository.SaveChangesAsync();

        return entity;
    }
}