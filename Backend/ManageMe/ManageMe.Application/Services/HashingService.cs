namespace ManageMe.Application.Services;

public interface IHashingService
{
    string HashPassword(string password);
    bool VerifyPassword(string passwordHash, string password);
}

public class HashingService : IHashingService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string passwordHash, string password)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}