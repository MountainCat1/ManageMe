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
        modelBuilder.Entity<AccountEntity>().HasMany<ProjectEntity>(x => x.Projects);
        modelBuilder.Entity<AccountEntity>().HasDiscriminator<string>("discriminator")
            .HasValue<GoogleAccountEntity>("google")
            .HasValue<LocalAccountEntity>("local");
        modelBuilder.Entity<AccountEntity>()
            .HasOne<RoleEntity>(x => x.Role)
            .WithMany(x => x.Accounts)
            .HasForeignKey(x => x.RoleId);
        
        // email
        modelBuilder.Entity<AccountEntity>().Property(x => x.Email).IsRequired();
        modelBuilder.Entity<AccountEntity>().HasIndex(x => x.Email).IsUnique();
        
        // username
        modelBuilder.Entity<AccountEntity>().Property(x => x.Username).IsRequired();
        
        // == PROJECTS
        modelBuilder.Entity<ProjectEntity>().HasKey(x => x.Id);
        modelBuilder.Entity<ProjectEntity>().HasMany<AccountEntity>(x => x.Members);
        
        // == ROLES
        modelBuilder.Entity<RoleEntity>().HasKey(x => x.Name);
    }

    public DbSet<AccountEntity> Accounts { get; set; }
    public DbSet<GoogleAccountEntity> GoogleAccounts { get; set; }
    
    public DbSet<ProjectEntity> Projects { get; set; }
    
    public DbSet<RoleEntity> Roles { get; set; }
}
