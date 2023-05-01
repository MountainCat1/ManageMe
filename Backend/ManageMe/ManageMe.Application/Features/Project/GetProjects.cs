using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Application.Extensions.Mapping;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using MediatR;

namespace ManageMe.Application.Features.Project;

public class GetAllProjectsRequest : IResultRequest<IEnumerable<ProjectDto>>
{
}


public class GetProjectsRequestHadler : IResultRequestHandler<GetAllProjectsRequest, IEnumerable<ProjectDto>>
{
    private IProjectRepository _projectRepository;

    public GetProjectsRequestHadler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result<IEnumerable<ProjectDto>>> Handle(GetAllProjectsRequest request, CancellationToken cancellationToken)
    {
        return await GetProjects()
            .BindAsync(MapToDto);           
    }

    private Task<Result<IEnumerable<ProjectDto>>> MapToDto(ICollection<ProjectEntity> entities)
    {
        var dtos = entities.Select(entity => entity.ToDto());

        return Result.SuccessTask(dtos);
    }

    private async Task<Result<ICollection<ProjectEntity>>> GetProjects()
    {
        var entities = await _projectRepository.GetAllAsync();
        
        return Result.Success(entities);
    }
}