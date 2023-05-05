using Catut;
using Catut.Errors;
using ManageMe.Application.Abstractions;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Funcionality;

public class DeleteFunctionalityRequest : IResultRequest
{
    public Guid FunctionalityId { get; set; }
    public Guid ProjectId { get; set; }
}

public class DeleteFunctionalityRequestHandler : IResultRequestHandler<DeleteFunctionalityRequest>
{
    private readonly IFunctionalityRepository _functionalityRepository;

    public DeleteFunctionalityRequestHandler(IFunctionalityRepository functionalityRepository)
    {
        _functionalityRepository = functionalityRepository;
    }

    public async Task<Result> Handle(DeleteFunctionalityRequest request, CancellationToken cancellationToken)
    {
        var functionality = await _functionalityRepository.GetOneAsync(request.FunctionalityId);

        if (functionality == null)
        {
            return Result.Failure(new NotFoundError());
        }

        if (functionality.ProjectId != request.ProjectId)
        {
            return Result.Failure(new InvalidOperationException());
        }

        await _functionalityRepository.DeleteAsync(functionality);

        var databaseException = await _functionalityRepository.SaveChangesAsync();

        if (databaseException is not null)
            return Result.Failure(databaseException);

        return Result.Success();
    }
}