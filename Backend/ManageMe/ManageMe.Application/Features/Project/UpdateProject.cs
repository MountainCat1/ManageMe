using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Project;

public class UpdateProjectRequest : IResultRequest
{
    public required Guid TargetProjectId { get; set; }
    public required ProjectDto Dto { get; set; }
}

public class UpdateProjectRequestHandler : IResultRequestHandler<UpdateProjectRequest>
{
    private IProjectRepository _projectRepository;

    public UpdateProjectRequestHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result> Handle(UpdateProjectRequest request, CancellationToken cancellationToken)
    {
        return await UpdateEntity(request.Dto);
    }

    private async Task<Result> UpdateEntity(ProjectDto update)
    {
        await _projectRepository.UpdateAsync(update, update.Id);

        await _projectRepository.SaveChangesAsync();

        return Result.Success();
    }
}