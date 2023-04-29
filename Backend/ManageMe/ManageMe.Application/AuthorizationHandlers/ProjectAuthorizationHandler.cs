using ManageMe.Application.Extensions;
using ManageMe.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace ManageMe.Application.AuthorizationHandlers;

public class ProjectAuthorizationHandler 
    : AuthorizationHandler<IsMemberOfProjectRequirement, ProjectAuthorizationHandler>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        IsMemberOfProjectRequirement requirement,
        ProjectAuthorizationHandler resource)
    {
        var userGuid = context.User.GetId();
        
        // TODO
        
        return;
    }
}

public class IsMemberOfProjectRequirement : IAuthorizationRequirement
{
    
}