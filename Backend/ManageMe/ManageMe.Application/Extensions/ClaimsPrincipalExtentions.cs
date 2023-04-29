using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;
using JwtConstants = System.IdentityModel.Tokens.Jwt.JwtConstants;

namespace ManageMe.Application.Extensions;

public static class ClaimsPrincipalExtentions
{
    public static Guid GetId(this ClaimsPrincipal user)
    {
        var claim = user.Claims.First(x => x.Type == ClaimTypes.Sid);

        return Guid.Parse(claim.Value);
    }
}