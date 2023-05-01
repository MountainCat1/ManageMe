using ManageMe.Api.Constants;
using ManageMe.Api.Extensions;
using ManageMe.Application.Features.Account;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Controllers;

[Authorize(AuthorizationPolicies.Authenticated)]
[ApiController]
[Route("api/account")]
public class AccountController : Controller
{
    private IMediator _mediator;

    public AccountController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAccount()
    {
        var request = new GetMyAccountRequest()
        {
            User = User
        };

        var result = await _mediator.Send(request);

        return result.ToOk();
    }
}