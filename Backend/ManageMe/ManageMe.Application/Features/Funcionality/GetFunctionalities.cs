using Catut;
using Catut.Errors;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Application.Extensions.Mapping;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Generics;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Generics;

namespace ManageMe.Application.Features.Funcionality;

public class GetFunctionalitiesRequest : IResultRequest<PagedResult<FunctionalityDto>>
{
    public Guid ProjectId { get; set; }
    public int? PageSize { get; set; }
    public int? PageNumber { get; set; }
}

public class GetFunctionalitiesRequestHandler : IResultRequestHandler<GetFunctionalitiesRequest, PagedResult<FunctionalityDto>>
{
    private readonly IFunctionalityRepository _functionalityRepository;

    public GetFunctionalitiesRequestHandler(IFunctionalityRepository functionalityRepository)
    {
        _functionalityRepository = functionalityRepository;
    }

    public async Task<Result<PagedResult<FunctionalityDto>>> Handle(GetFunctionalitiesRequest request,
        CancellationToken cancellationToken)
    {
        var functionalities = await _functionalityRepository
            .GetPaginatedAsync(x => x.ProjectId == request.ProjectId, 
                null, 
                request.PageNumber ?? 1, 
                request.PageSize ?? 10);
        
        
        var dtoList = functionalities.Items.Select(f => f.ToDto()).ToList();

        var pagedListDto = new PagedResult<FunctionalityDto>(
            dtoList, 
            functionalities.TotalCount, 
            functionalities.PageSize, 
            functionalities.PageNumber, 
            functionalities.TotalCount);

        return Result.Success(pagedListDto);
    }
}