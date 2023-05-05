using System.Security.Claims;

namespace ManageMe.Application.Extensions;

public static class ClaimsPrincipalExtentions
{
    public static Guid GetId(this ClaimsPrincipal user)
    {
        var claim = user.Claims.First(x => x.Type == ClaimTypes.Sid);

        return Guid.Parse(claim.Value);
    }
}