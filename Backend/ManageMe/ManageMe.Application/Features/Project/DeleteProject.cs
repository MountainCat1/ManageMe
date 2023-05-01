using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Project;

public class DeleteProjectRequest : IResultRequest
{
    public required Guid TargetToDelete { get; set; }
}

public class DeleteProjectRequestHandler : IResultRequestHandler<DeleteProjectRequest>
{
    private IProjectRepository _projectRepository;

    public DeleteProjectRequestHandler(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    public async Task<Result> Handle(DeleteProjectRequest request, CancellationToken cancellationToken)
    {
        return await DeleteEntity(request.TargetToDelete);
    }

    private async Task<Result> DeleteEntity(Guid projectId)
    {
        await _projectRepository.DeleteAsync(projectId);

        await _projectRepository.SaveChangesAsync();

        return Result.Success();
    }
}