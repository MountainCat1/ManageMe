using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Controllers;

[ApiController]
[Route("api/{functionalityId:guid}/task-tem")]
public class TaskItemController : Controller
{
    [HttpPost]
    public async Task<IActionResult> Create([FromRoute] Guid functionalityId)
    {
        throw new NotImplementedException();
    }
}