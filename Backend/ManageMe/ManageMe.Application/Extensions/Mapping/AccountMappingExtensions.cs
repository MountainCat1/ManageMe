﻿using ManageMe.Application.Dtos;
using ManageMe.Domain.Entities;

namespace ManageMe.Application.Extensions.Mapping;

public static class AccountMappingExtensions
{
    public static AccountDto ToDto(this AccountEntity accountEntity)
    {
        return new AccountDto()
        {
            Username = accountEntity.Username,
            Email = accountEntity.Email,
            Name = accountEntity.Name,
            Surname = accountEntity.Surname,
            Role = accountEntity.Role.ToDto()
        };
    }
}