using ManageMe.Api.Extensions;
using ManageMe.Application.Features.Authentication;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class LocalAuthenticationController : Controller
{
    private IMediator _mediator;

    public LocalAuthenticationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Authenticate(AuthiViaPassowrdRequest authiViaPassowrdRequest)
    {
        var result = await _mediator.Send(authiViaPassowrdRequest);

        return result.ToOk();
    }
}