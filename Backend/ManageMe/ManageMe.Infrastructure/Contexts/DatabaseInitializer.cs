using ManageMe.Domain.Entities;

namespace ManageMe.Infrastructure.Contexts;

public class DatabaseInitializer
{
    public void Seed(ManageMeDbContext context)
    {
        var doesDeveloperExist = context.Roles
            .FirstOrDefault(x => x.Name == "Developer") is not null;

        if (!doesDeveloperExist)
        {
            var roles = new List<RoleEntity>
            {
                RoleEntity.Create("Developer"),
            };

            context.Roles.AddRange(roles);
        }

        context.SaveChanges();
    }
}