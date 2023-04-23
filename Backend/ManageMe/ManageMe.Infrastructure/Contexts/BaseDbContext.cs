using ManageMe.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ManageMe.Infrastructure.Contexts;

public class ManageMeDbContext : DbContext
{
    public ManageMeDbContext(DbContextOptions<ManageMeDbContext> options) : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // == ACCOUNTS
        modelBuilder.Entity<AccountEntity>().HasKey(x => x.Id);
        modelBuilder.Entity<AccountEntity>().HasDiscriminator<string>("discriminator")
            .HasValue<GoogleAccountEntity>("google");
        
        // email
        modelBuilder.Entity<AccountEntity>().Property(x => x.Email).IsRequired();
        modelBuilder.Entity<AccountEntity>().HasIndex(x => x.Email).IsUnique();
        
        // username
        modelBuilder.Entity<AccountEntity>().Property(x => x.Username).IsRequired();
    }

    public DbSet<AccountEntity> AccountEntities { get; set; }
    public DbSet<GoogleAccountEntity> GoogleAccountEntities { get; set; }
}