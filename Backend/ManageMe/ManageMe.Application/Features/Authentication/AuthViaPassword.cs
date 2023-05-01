﻿using Catut;
using Catut.Errors;
using Google.Apis.Auth;
using ManageMe.Application.Abstractions;
using ManageMe.Application.Dtos.Responses;
using ManageMe.Application.Services;
using ManageMe.Domain.Entities;
using ManageMe.Domain.Repositories;

namespace ManageMe.Application.Features.Authentication;


public class AuthiViaPassowrdRequest : IResultRequest<AuthTokenResponseContract>
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class AuthiViaPassowrdRequestHandler : IResultRequestHandler<AuthiViaPassowrdRequest, AuthTokenResponseContract>
{
    private ILocalAccountRepository _accountRepository;
    private IJwtService _jwtService;
    private IHashingService _hashingService;

    public AuthiViaPassowrdRequestHandler(
        ILocalAccountRepository accountRepository,
        IJwtService jwtService, 
        IHashingService hashingService)
    {
        _accountRepository = accountRepository;
        _jwtService = jwtService;
        _hashingService = hashingService;
    }

    public async Task<Result<AuthTokenResponseContract>> Handle(AuthiViaPassowrdRequest request,
        CancellationToken cancellationToken)
    {
        return await GetAccount(request.Email)
            .BindAsync(entity => ValidatePassword(entity, request.Password))
            .BindAsync(GenerateAuthResponse);
    }

    private async Task<Result<AuthTokenResponseContract>> GenerateAuthResponse(AccountEntity accountEntity)
    {
        return Result<AuthTokenResponseContract>.Success(new AuthTokenResponseContract()
        {
            AuthToken = _jwtService.GenerateAsymmetricJwtToken(accountEntity)
        });
    }

    private async Task<Result<AccountEntity>> ValidatePassword(LocalAccountEntity account, string password)
    {
        if (!_hashingService.VerifyPassword(account.PasswordHash, password))
        {
            return Result<AccountEntity>.Failure(new UnauthorizedAccessException());
        }

        return Result<AccountEntity>.Success(account);
    }

    private async Task<Result<LocalAccountEntity>> GetAccount(string email)
    {
        var account = await _accountRepository.GetOneRequiredAsync(x => x.Email == email);
        return Result.Success(account);
    }
}