using ManageMe.Api.Constants;
using ManageMe.Api.Extensions;
using ManageMe.Application.Features.Project;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Controllers;

[Authorize(AuthorizationPolicies.Authenticated)]
[ApiController]
[Route("api/project")]
public class ProjectController : Controller
{
    private ILogger<ProjectController> _logger;
    private IMediator _mediator;

    public ProjectController(
        IMediator mediator, 
        ILogger<ProjectController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectRequest request)
    {
        var result = await _mediator.Send(request);
        
        return result.ToOk();
    }
}