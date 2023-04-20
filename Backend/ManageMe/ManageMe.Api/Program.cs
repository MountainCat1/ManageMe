using FluentValidation;
using FluentValidation.AspNetCore;
using ManageMe.Api.MediaRBehaviors;
using ManageMe.Application;
using ManageMe.Application.Features.GoogleAuthentication;
using ManageMe.Application.Services;
using ManageMe.Domain.Repositories;
using ManageMe.Infrastructure.Contexts;
using ManageMe.Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

var services = builder.Services;

services.AddLogging();

services.AddControllers();
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

if (builder.Environment.IsDevelopment())
    services.AddDbContext<ManageMeDbContext>(options 
        => options.UseSqlite(configuration.GetConnectionString("ManageMeDatabase")));
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();