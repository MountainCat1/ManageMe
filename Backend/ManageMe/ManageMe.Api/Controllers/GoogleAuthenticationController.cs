using Catut;
using ManageMe.Api.Extensions;
using ManageMe.Application.Dtos.Responses;
using ManageMe.Application.Features.GoogleAuthentication;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Controllers;

[ApiController]
[Route("api/auth/google")]
public class GoogleAuthentication : Controller
{
    private IMediator _mediator;

    public GoogleAuthentication(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthiViaGoogleRequestContract contract)
    {
        var mediatorRequest = new CreateGoogleAccountRequest(contract.AuthToken);

        Result result = await _mediator.Send(mediatorRequest);

        return result.ToOk();
    }


    [HttpPost()]
    public async Task<IActionResult> Authenticate([FromBody] AuthiViaGoogleRequestContract contract)
    {
        var mediatorRequest = new AuthiViaGoogleRequest
        {
            GoogleAuthToken = contract.AuthToken
        };

        Result<AuthTokenResponseContract> result = await _mediator.Send(mediatorRequest);

        return result.ToOk();
    }
}