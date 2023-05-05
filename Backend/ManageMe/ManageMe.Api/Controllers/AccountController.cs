using ManageMe.Api.Constants;
using ManageMe.Api.Extensions;
using ManageMe.Application.Dtos;
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
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAccountRequest createAccountRequest)
    {
        var result = await _mediator.Send(createAccountRequest);

        return result.ToOk();
    }
    
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var result = await _mediator.Send(new DeleteAccountRequest()
        {
            AccountToDeleteId = id
        });

        return result.ToOk();
    }
    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Delete([FromBody] AccountDto updateDto, [FromRoute] Guid id)
    {
        var result = await _mediator.Send(new UpdateAccountRequest()
        {
            AccountToUpdateId = id,
            UpdateDto = updateDto
        });

        return result.ToOk();
    }
}