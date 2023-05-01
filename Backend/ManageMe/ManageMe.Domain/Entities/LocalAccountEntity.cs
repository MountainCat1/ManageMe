namespace ManageMe.Domain.Entities;

public class LocalAccountEntity : AccountEntity
{
    public string PasswordHash { get; set; }
    
    protected LocalAccountEntity(string email, string username) : base(email, username)
    {
    }

    public static LocalAccountEntity Create(string email, string username, string passwordHash)
    {
        var newAccount = new LocalAccountEntity(email, username)
        {
            PasswordHash = passwordHash
        };

        return newAccount;
    }
}