using Catut;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Services;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Account;

public class CreateAccountRequest : IResultRequest
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
}

public class CreateAccountRequestHandler : IResultRequestHandler<CreateAccountRequest>
{
    private IHashingService _hashingService;
    private ILocalAccountRepository _accountRepository;
    
    
    public CreateAccountRequestHandler(IHashingService hashingService, ILocalAccountRepository accountRepository)
    {
        _hashingService = hashingService;
        _accountRepository = accountRepository;
    }

    public async Task<Result> Handle(CreateAccountRequest request, CancellationToken cancellationToken)
    {
        return await CreateAccount(request)
            .BindAsync(SaveNewAccountInDatabase);
    }

    private async Task<Result> SaveNewAccountInDatabase(LocalAccountEntity accountEntity)
    {
        await _accountRepository.AddAsync(accountEntity);

        await _accountRepository.SaveChangesAsync();

        return Result.Success();
    }

    private async Task<Result<LocalAccountEntity>> CreateAccount(CreateAccountRequest request)
    {
        var passwordHash = _hashingService.HashPassword(request.Password);

        return LocalAccountEntity.Create(request.Email, request.Username,  request.Name, request.Surname, passwordHash);
    }
}