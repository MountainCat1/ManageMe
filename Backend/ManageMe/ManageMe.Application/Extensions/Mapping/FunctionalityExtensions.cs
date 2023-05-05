using ManageMe.Application.Dtos;
using ManageMe.Domain.Entities;

namespace ManageMe.Application.Extensions.Mapping;

public static class FunctionalityExtensions
{
    public static FunctionalityDto ToDto(this FunctionalityEntity entity)
    {
        var dto = new FunctionalityDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Priority = entity.Priority,
            ProjectId = entity.ProjectId,
            OwnerId = entity.OwnerId,
            Status = entity.Status,
        };
        
        return dto;
    }
}