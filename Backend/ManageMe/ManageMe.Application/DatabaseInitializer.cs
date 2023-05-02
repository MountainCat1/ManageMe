using ManageMe.Application.Services;
using ManageMe.Domain.Entities;
using ManageMe.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ManageMe.Application;

public class DatabaseInitializer
{
    public async Task Seed(ManageMeDbContext context, IServiceProvider serviceProvider)
    {
        var adminRole = await context.Roles
            .FirstOrDefaultAsync(x => x.Name == "Admin");
        var adminUser = await context.Accounts
            .FirstOrDefaultAsync(x => x.Name == "Admin");

        if (adminRole is null)
        {
            var roles = new List<RoleEntity>
            {
                RoleEntity.Create("Admin"),
                RoleEntity.Create("Developer"),
                RoleEntity.Create("Devops"),
            };

            context.Roles.AddRange(roles);
        }

        if (adminUser is null)
        {
            var hashingService = serviceProvider.GetRequiredService<IHashingService>();
            var account = LocalAccountEntity.Create("admin",
                "admin",
                "admin",
                "admin",
                hashingService.HashPassword("admin"));

            account.RoleId = "Admin";

            context.Accounts.Add(account);
        }

        await context.SaveChangesAsync();
    }
}