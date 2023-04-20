using ManageMe.Domain.Abstractions;

namespace ManageMe.Domain.Entities;

public class AccountEntity : IEntity
{
    public Guid Id { get; set; }
    public string Email { get; set; }

    private AccountEntity(){ }
    
    public AccountEntity Create(string email)
    {
        var createdEntity = new AccountEntity()
        {
            Email = email,
        };

        return createdEntity;
    }
}