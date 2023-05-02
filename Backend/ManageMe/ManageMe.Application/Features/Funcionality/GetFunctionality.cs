using Catut;
using Catut.Errors;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Application.Extensions.Mapping;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Funcionality;

public class GetFunctionalityRequest : IResultRequest<FunctionalityDto>
{
    public Guid FunctionalityId { get; set; }
    public Guid ProjectId { get; set; }
}

public class GetFunctionalityRequestHandler : IResultRequestHandler<GetFunctionalityRequest, FunctionalityDto>
{
    private readonly IFunctionalityRepository _functionalityRepository;

    public GetFunctionalityRequestHandler(IFunctionalityRepository functionalityRepository)
    {
        _functionalityRepository = functionalityRepository;
    }

    public async Task<Result<FunctionalityDto>> Handle(GetFunctionalityRequest request, CancellationToken cancellationToken)
    {
        var functionality = await _functionalityRepository.GetOneAsync(request.FunctionalityId);

        if (functionality == null)
        {
            return Result.Failure<FunctionalityDto>(new NotFoundError());
        }

        if (functionality.ProjectId != request.ProjectId)
        {
            return Result.Failure<FunctionalityDto>(new InvalidOperationException());
        }
        
        return Result.Success(functionality.ToDto());
    }
}