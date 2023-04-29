﻿using ManageMe.Domain.Entities;
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
            .HasValue<GoogleAccountEntity>("google");
        
        // email
        modelBuilder.Entity<AccountEntity>().Property(x => x.Email).IsRequired();
        modelBuilder.Entity<AccountEntity>().HasIndex(x => x.Email).IsUnique();
        
        // username
        modelBuilder.Entity<AccountEntity>().Property(x => x.Username).IsRequired();
        
        // == PROJECTS
        modelBuilder.Entity<ProjectEntity>().HasKey(x => x.Id);
        modelBuilder.Entity<ProjectEntity>().HasMany<AccountEntity>(x => x.Members);
    }

    public DbSet<AccountEntity> Accounts { get; set; }
    public DbSet<GoogleAccountEntity> GoogleAccounts { get; set; }
    
    public DbSet<ProjectEntity> Projects { get; set; }
}
