using ManageMe.Api.Extensions;
using ManageMe.Application.Dtos;
using ManageMe.Application.Features.Funcionality;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace ManageMe.Api.Controllers;


// [Authorize]
[ApiController]
[Route("/api/{projectId:guid}/functionality")]
public class FunctionalityController : Controller
{
    private IMediator _mediator;


    public FunctionalityController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFunctionalityRequest request, [FromRoute] Guid projectId)
    {
        request.ProjectId = projectId;
        
        var result = await _mediator.Send(request);

        return result.ToOk();
    }
    
    [HttpPut("{functionalityId:guid}")]
    public async Task<IActionResult> Update([FromBody] FunctionalityDto dto, [FromRoute] Guid projectId, [FromRoute] Guid functionalityId)
    {
        var request = new UpdateFunctionalityReqeust()
        {
            ProjectId = projectId,
            FunctionalityId = functionalityId,
            UpdateDto = dto
        };
        
        var result = await _mediator.Send(request);

        return result.ToOk();
    }
    
    [HttpGet]
    public async Task<IActionResult> Get([FromRoute] Guid projectId, [FromQuery] int? pageSize, [FromQuery] int? pageNumer)
    {
        var request = new GetFunctionalitiesRequest()
        {
            ProjectId = projectId,
            PageNumber = pageNumer,
            PageSize = pageSize
        };
        
        var result = await _mediator.Send(request);

        return result.ToOk();
    }
}