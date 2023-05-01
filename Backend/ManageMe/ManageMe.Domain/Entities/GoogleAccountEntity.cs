namespace ManageMe.Domain.Entities;

public class GoogleAccountEntity : AccountEntity
{
    public GoogleAccountEntity(string email, string username, string name, string surname) : base(email, username, name, surname)
    {
    }
}