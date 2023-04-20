using Catut;
using Catut.Errors;
using Google.Apis.Auth;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos.Responses;
using ManageMe.Application.Services;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.GoogleAuthentication;

public class AuthiViaGoogleRequestContract
{
    public required string AuthToken { get; set; }
}

public class AuthiViaGoogleRequest : IResultRequest<AuthTokenResponseContract>
{
    public required string GoogleAuthToken { get; set; }
}

public class AuthiViaGoogleRequestHandler : IResultRequestHandler<AuthiViaGoogleRequest, AuthTokenResponseContract>
{
    private IAccountRepository _accountRepository;
    private IGoogleAuthProviderService _authProviderService;
    private IJwtService _jwtService;

    public AuthiViaGoogleRequestHandler(
        IAccountRepository accountRepository,
        IGoogleAuthProviderService authProviderService,
        IJwtService jwtService)
    {
        _accountRepository = accountRepository;
        _authProviderService = authProviderService;
        _jwtService = jwtService;
    }

    public async Task<Result<AuthTokenResponseContract>> Handle(AuthiViaGoogleRequest request,
        CancellationToken cancellationToken)
    {
        return
            await ValidateGoogleJwt(request)
                .BindAsync(GetAccount)
                .BindAsync(GenerateJwt)
                .BindAsync(CreateResponseDto);
    }

    private async Task<Result<AuthTokenResponseContract>> CreateResponseDto(string jwt) =>
        new AuthTokenResponseContract()
        {
            AuthToken = jwt
        };

    private async Task<Result<string>> GenerateJwt(AccountEntity accountEntity)
        => _jwtService.GenerateAsymmetricJwtToken(accountEntity);

    private async Task<Result<AccountEntity>> GetAccount(GoogleJsonWebSignature.Payload payload)
        => await _accountRepository.GetAccountByEmailAsync(payload.Email)
           ?? Result<AccountEntity>.Failure(new NotFoundError());

    private async Task<Result<GoogleJsonWebSignature.Payload>> ValidateGoogleJwt(AuthiViaGoogleRequest request)
    {
        return await _authProviderService.ValidateGoogleJwtAsync(request.GoogleAuthToken);
    }
}