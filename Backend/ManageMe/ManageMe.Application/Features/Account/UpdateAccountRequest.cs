using Catut;
using Google.Apis.Auth.OAuth2;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Account;

public class UpdateAccountRequest : IResultRequest
{
    public Guid AccountToUpdateId { get; set; }
    public AccountDto UpdateDto { get; set; }
}


public class UpdateAccountRequestHandler : IResultRequestHandler<UpdateAccountRequest>
{
    private IAccountRepository _accountRepository;

    public UpdateAccountRequestHandler(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

    public async Task<Result> Handle(UpdateAccountRequest request, CancellationToken cancellationToken)
    {
        return await UpdateAccount(request.UpdateDto, request.AccountToUpdateId);
    }

    private async Task<Result> UpdateAccount(AccountDto accountDto, Guid accountGuid)
    {
        await _accountRepository.UpdateAsync(accountDto, accountGuid);

        await _accountRepository.SaveChangesAsync();

        return Result.Success();
    }
}