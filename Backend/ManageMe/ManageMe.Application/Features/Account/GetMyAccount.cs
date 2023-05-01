using System.Security.Claims;
using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Application.Errors;
using ManageMe.Application.Extensions.Mapping;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;
using Microsoft.AspNetCore.Http;

namespace ManageMe.Application.Features.Account;

public class GetMyAccountRequest : IResultRequest<AccountDto>
{
    public required ClaimsPrincipal User { get; set; }
}

public class GetMyAccountRequestHandler : IResultRequestHandler<GetMyAccountRequest, AccountDto>
{
    private IAccountRepository _accountRepository;

    public GetMyAccountRequestHandler(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

    public async Task<Result<AccountDto>> Handle(GetMyAccountRequest request, CancellationToken cancellationToken)
    {
        return await GetAccount(request.User)
            .BindAsync(MapToDto);
    }

    private async Task<Result<AccountDto>> MapToDto(AccountEntity accountEntity)
    {
        return accountEntity.ToDto();
    }

    private async Task<Result<AccountEntity>> GetAccount(ClaimsPrincipal requestUser)
    {
        var idClaim = requestUser.Claims.First(x => x.Type == ClaimTypes.PrimarySid);
        var entity = await _accountRepository.GetWithRoleAsync(Guid.Parse(idClaim.Value));

        if (entity is null)
            return Result.Failure<AccountEntity>(new NotFoundError());
        
        return entity;
    }
}