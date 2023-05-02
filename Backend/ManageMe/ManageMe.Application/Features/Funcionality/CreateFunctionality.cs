using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using MediatR;

namespace ManageMe.Application.Features.Funcionality;

public class CreateFunctionalityRequest : IResultRequest
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int Priority { get; set; }
    public Guid ProjectId { get; set; }
}


public class CreateFunctionalityRequestHandler : IResultRequestHandler<CreateFunctionalityRequest>
{
    private IFunctionalityRepository _functionalityRepository;

    public CreateFunctionalityRequestHandler(IFunctionalityRepository functionalityRepository)
    {
        _functionalityRepository = functionalityRepository;
    }

    public async Task<Result> Handle(CreateFunctionalityRequest request, CancellationToken cancellationToken)
    {
        return
            await CreateEntity(request)
                .BindAsync(SaveToDatabase);
    }

    private static Task<Result<FunctionalityEntity>> CreateEntity(CreateFunctionalityRequest request)
    {
        return FunctionalityEntity.Create(request.Name, request.Description, request.Priority, request.ProjectId,
            null, FunctionalityStatus.Todo);
    }

    private async Task<Result> SaveToDatabase(FunctionalityEntity entity)
    {
        await _functionalityRepository.AddAsync(entity);

        await _functionalityRepository.SaveChangesAsync();

        return Result.Success();
    }
}