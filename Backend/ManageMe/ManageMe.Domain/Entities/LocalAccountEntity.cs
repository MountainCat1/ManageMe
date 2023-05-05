using System.Diagnostics.Metrics;

namespace ManageMe.Domain.Entities;

public class LocalAccountEntity : AccountEntity
{
    public string PasswordHash { get; set; }
    

    public static LocalAccountEntity Create(string email, string username, string name, string surname, string passwordHash)
    {
        var newAccount = new LocalAccountEntity(email, username, name, surname)
        {
            PasswordHash = passwordHash
        };

        return newAccount;
    }

    protected LocalAccountEntity(string email, string username, string name, string surname) : base(email, username, name, surname)
    {
    }
}