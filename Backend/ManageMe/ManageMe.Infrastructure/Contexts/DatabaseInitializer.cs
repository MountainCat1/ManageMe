using ManageMe.Domain.Entities;

namespace ManageMe.Infrastructure.Contexts;

public class DatabaseInitializer
{
    public void Seed(ManageMeDbContext context)
    {
        var doesAdminRoleExists = context.Roles
            .FirstOrDefault(x => x.Name == "Admin") is not null;

        if (!doesAdminRoleExists)
        {
            var roles = new List<RoleEntity>
            {
                RoleEntity.Create("Admin"),
                RoleEntity.Create("Developer"),
                RoleEntity.Create("Devops"),
            };

            context.Roles.AddRange(roles);
        }

        context.SaveChanges();
    }
}