using ManageMe.Application.Dtos;
using ManageMe.Domain.Entities;

namespace ManageMe.Application.Extensions.Mapping;

public static class RoleMappingExtensions
{
    public static RoleDto ToDto(this RoleEntity roleEntity)
    {
        var roleDto = new RoleDto
        {
            Name = roleEntity.Name,
        };

        return roleDto;
    }
}