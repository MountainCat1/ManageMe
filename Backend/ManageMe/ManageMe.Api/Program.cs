using Catut.Configuration;
using FluentValidation;
using FluentValidation.AspNetCore;
using ManageMe.Api.Extensions;
using ManageMe.Api.MediaRBehaviors;
using ManageMe.Application;
using ManageMe.Application.Features.GoogleAuthentication;
using ManageMe.Application.Services;
using ManageMe.Application.Settings;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
// ========= CONFIGURATION  =========
var configuration = builder.Configuration;

configuration.AddJsonFile("Secrets/authentication.json");
configuration.AddJsonFile("Secrets/jwt.json");

var jwtConfig = configuration.GetConfiguration<JwtConfig>();

var services = builder.Services;

services.Configure<AuthenticationConfig>(configuration.GetSection(nameof(AuthenticationConfig)));
services.Configure<JwtConfig>(configuration.GetSection(nameof(JwtConfig)));

services.AddLogging();

services.AddControllers();
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
    services.AddDbContext<ManageMeDbContext>(options
        => options.UseSqlServer(configuration.GetConnectionString("ManageMeDatabase"), 
            b => b.MigrationsAssembly(typeof(Program).Assembly.FullName)));

// options.UseSqlServer(connection, b => b.MigrationsAssembly("ManageMe.Api"))
else
    services.AddDbContext<ManageMeDbContext>(options
        => options.UseSqlServer(configuration.GetConnectionString("ManageMeDatabase")));


services.AddScoped<IAccountRepository, AccountRepository>();
services.AddScoped<IGoogleAccountRepository, GoogleAccountRepository>();

services.AddScoped<IGoogleAuthProviderService, GoogleAuthProviderService>();
services.AddScoped<IHashingService, HashingService>();
services.AddScoped<IJwtService, JwtService>();

services.AddFluentValidationAutoValidation();
services.AddValidatorsFromAssemblyContaining<ServiceAssemlyMarker>();
services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

services.AddScoped<IHashingService, HashingService>();
services.AddScoped<IJwtService, JwtService>();

services.AddMediatR(serviceConfiguration =>
{
    serviceConfiguration.RegisterServicesFromAssembly(typeof(MediarAssemblyMarker).Assembly);
});

services.AddAsymmetricAuthentication(jwtConfig);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("https://localhost:4200", "http://localhost:4200"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();