using ManageMe.Application.Dtos;
using ManageMe.Domain.Entities;

namespace ManageMe.Application.Extensions.Mapping;

public static class ProjectMappingExtensions
{
    public static ProjectDto ToDto(this ProjectEntity entity)
    {
        return new ProjectDto()
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            StartTime = entity.StartTime,
            EndTime = entity.EndTime
        };
    }
}