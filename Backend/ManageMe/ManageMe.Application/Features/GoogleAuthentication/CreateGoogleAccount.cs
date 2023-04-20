using Catut;
using Google.Apis.Auth;
using ManageMe.Application.Abstractions;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.GoogleAuthentication;

public class CreateGoogleAccountRequestContract
{
    public required string AuthToken { get; set; }
}

public class CreateGoogleAccountRequest : IResultRequest
{
    public CreateGoogleAccountRequest(string googleAuthToken)
    {
        GoogleAuthToken = googleAuthToken;
    }

    public string GoogleAuthToken { get; set; }
}

public class CreateGoogleAccountRequestHandler : IResultRequestHandler<CreateGoogleAccountRequest>
{
    private readonly IGoogleAccountRepository _googleAccountRepository;
    private readonly IGoogleAuthProviderService _googleService;

    public CreateGoogleAccountRequestHandler(IGoogleAccountRepository googleAccountRepository,
        IGoogleAuthProviderService googleService)
    {
        _googleAccountRepository = googleAccountRepository;
        _googleService = googleService;
    }

    public async Task<Result> Handle(CreateGoogleAccountRequest request, CancellationToken cancellationToken)
    {
        return await ValidateGoogleJwt(request)
            .BindAsync(CreateEntity)
            .BindAsync(SaveInDatabase);
    }

    private async Task<Result> SaveInDatabase(GoogleAccountEntity googleAccount)
    {
        await _googleAccountRepository.AddAsync(googleAccount);

        var dbException = await _googleAccountRepository.SaveChangesAsync();

        if (dbException is not null)
            return Result.Failure(dbException);
        
        return Result.Success();
    }

    private static Task<Result<GoogleAccountEntity>> CreateEntity(GoogleJsonWebSignature.Payload googleTokenPayload) =>
        Task.FromResult<Result<GoogleAccountEntity>>(new GoogleAccountEntity(
            email: googleTokenPayload.Email,
            username: googleTokenPayload.Name
        ));

    private async Task<Result<GoogleJsonWebSignature.Payload>> ValidateGoogleJwt(CreateGoogleAccountRequest request) 
        => await _googleService.ValidateGoogleJwtAsync(request.GoogleAuthToken);
}