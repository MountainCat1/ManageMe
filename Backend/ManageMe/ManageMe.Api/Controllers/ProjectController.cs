using ManageMe.Api.Constants;
using ManageMe.Api.Extensions;
using ManageMe.Application.Dtos;
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
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var request = new GetAllProjectsRequest();
        
        var result = await _mediator.Send(request);
        
        return result.ToOk();
    }
    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOne(Guid id)
    {
        var request = new GetProjectRequest()
        {
            ProjectId = id
        };
        
        var result = await _mediator.Send(request);
        
        return result.ToOk();
    }
    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromBody] ProjectDto updateDto, [FromRoute] Guid id)
    {
        var request = new UpdateProjectRequest()
        {
            Dto = updateDto,
            TargetProjectId = id
        };
        
        var result = await _mediator.Send(request);
        
        return result.ToOk();
    }
    
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id)
    {
        var request = new DeleteProjectRequest()
        {
            TargetToDelete = id
        };
        
        var result = await _mediator.Send(request);
        
        return result.ToOk();
    }
}