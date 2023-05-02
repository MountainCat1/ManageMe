using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Application.Errors;
using ManageMe.Application.Extensions.Mapping;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Project;

public class GetProjectRequest : IResultRequest<ProjectDto>
{
    public required Guid ProjectId { get; set; }
}


public class GetProjectRequestHadler : IResultRequestHandler<GetProjectRequest, ProjectDto>
{
    private IProjectRepository _projectRepository;

    public GetProjectRequestHadler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<ProjectDto>> Handle(GetProjectRequest request, CancellationToken cancellationToken)
    {
        return await GetProject(request.ProjectId)
            .BindAsync(MapToDto);           
    }

    private Task<Result<ProjectDto>> MapToDto(ProjectEntity entity)
    {
        var dtos = entity.ToDto();

        return Result.SuccessTask(dtos);
    }

    private async Task<Result<ProjectEntity>> GetProject(Guid guid)
    {
        var entity = await _projectRepository.GetOneAsync(guid);

        return entity is null 
            ? Result.Failure<ProjectEntity>(new NotFoundError()) 
            : Result.Success(entity);
    }
}