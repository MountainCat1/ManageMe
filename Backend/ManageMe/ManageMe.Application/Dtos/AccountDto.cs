﻿using ManageMe.Domain.Entities;

namespace ManageMe.Application.Dtos;

public class AccountDto
{
    public string Email { get; set; }
    public string Username { get; set; }
    public RoleDto Role { get; set; }
}