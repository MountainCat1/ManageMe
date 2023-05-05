using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Catut;
using Catut.Configuration;
using ManageMe.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ManageMe.Application.Services;

public interface IJwtService
{
    public string GenerateAsymmetricJwtToken(ClaimsIdentity claimsIdentity);
    public string GenerateAsymmetricJwtToken(AccountEntity accountDto);
}

public class JwtService : IJwtService
{
    private readonly JwtConfig _jwtConfig;

    public JwtService(IOptions<JwtConfig> jwtConfiguration)
    {
        _jwtConfig = jwtConfiguration.Value;
    }
    public string GenerateAsymmetricJwtToken(ClaimsIdentity claimsIdentity)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        string stringToken = String.Empty;    
        
        using (var rsa = RSA.Create())
        {
            rsa.ImportRSAPrivateKey(Convert.FromBase64String(_jwtConfig.SecretKey), out int _);
            
            var signingCredentials = new SigningCredentials(
                key: new RsaSecurityKey(rsa.ExportParameters(true)),
                algorithm: SecurityAlgorithms.RsaSha256 // Important to use RSA version of the SHA algo 
            );
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claimsIdentity,
                Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.Expires),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                SigningCredentials = signingCredentials
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            stringToken = tokenHandler.WriteToken(token);
        }

        return stringToken;
    }

    public string GenerateAsymmetricJwtToken(AccountEntity account)
    {
        return GenerateAsymmetricJwtToken(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.PrimarySid, account.Id.ToString()),
            new Claim(ClaimTypes.Email, account.Email),
        }));
    }

    private string GenerateSymmetricJwtToken(ClaimsIdentity claimsIdentity)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtConfig.SecretKey);
        
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = claimsIdentity,
            Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.Expires),
            Issuer = _jwtConfig.Issuer,
            Audience = _jwtConfig.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}