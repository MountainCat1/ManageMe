using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Account;

public class DeleteAccountRequest : IResultRequest
{
    public required Guid AccountToDeleteId { get; set; }
}


public class DeleteAccountRequestHandler : IResultRequestHandler<DeleteAccountRequest>
{
    private IAccountRepository _accountRepository;

    public DeleteAccountRequestHandler(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

    public async Task<Result> Handle(DeleteAccountRequest request, CancellationToken cancellationToken)
    {
        return await GetAccount(request.AccountToDeleteId);
    }

    private async Task<Result> GetAccount(Guid accountId)
    {
        await _accountRepository.DeleteAsync(accountId);

        await _accountRepository.SaveChangesAsync();

        return Result.Success();
    }
}