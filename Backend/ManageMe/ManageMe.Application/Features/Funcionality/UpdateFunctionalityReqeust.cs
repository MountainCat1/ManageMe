using Catut;
using Catut.Errors;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Funcionality;

public class UpdateFunctionalityReqeust : IResultRequest
{
    public Guid FunctionalityId { get; set; }
    public Guid ProjectId { get; set; }
    public FunctionalityDto UpdateDto { get; set; }
}

public class UpdateFunctionalityReqeustHandler : IResultRequestHandler<UpdateFunctionalityReqeust>
{
    private IFunctionalityRepository _functionalityRepository;

    public UpdateFunctionalityReqeustHandler(IFunctionalityRepository functionalityRepository)
    {
        _functionalityRepository = functionalityRepository;
    }

    public async Task<Result> Handle(UpdateFunctionalityReqeust request, CancellationToken cancellationToken)
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

        request.UpdateDto.Id = request.FunctionalityId;

        await _functionalityRepository.UpdateAsync(request.UpdateDto, request.FunctionalityId);
        
        var databaseException = await _functionalityRepository.SaveChangesAsync();

        if (databaseException is not null)
            return Result.Failure(databaseException);

        return Result.Success();
    }
}