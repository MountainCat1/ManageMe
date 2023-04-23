using ManageMe.Application.Features.GetClaims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Controllers;

[ApiController]
[Route("/api/claims")]
public class ClaimsController : Controller
{
    private IMediator _mediator;

    public ClaimsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetClaims()
    {
        var mediatorResuest = new GetClaimsRequest(User);

        GetClaimsResponseDto resultDto = await _mediator.Send(mediatorResuest);

        return Ok(resultDto);
    }
}