﻿namespace ManageMe.Application.Dtos.Responses;

public class ClaimDto
{
    public ClaimDto(string type, string value)
    {
        Type = type;
        Value = value;
    }

    public string Type { get; init; }
    public string Value { get; init; }
}