using Microsoft.EntityFrameworkCore;

namespace ManageMe.Infrastructure.Contexts;

public class ManageMeDbContext : DbContext
{
    public ManageMeDbContext(DbContextOptions<ManageMeDbContext> options) : base(options)
    {
        
    }
}