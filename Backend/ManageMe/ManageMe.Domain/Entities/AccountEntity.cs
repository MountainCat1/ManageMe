using ManageMe.Domain.Abstractions;
using ManageMe.Domain.DomainEvents;

namespace ManageMe.Domain.Entities;

public abstract class AccountEntity : Entity
{
    protected AccountEntity(string email, string username)
    {
        Username = username;
        Email = email;
        RoleId = "Developer";
        
        AddDomainEvent(new CreateAccountDomainEvent());
    }

    public Guid Id { get; set; }

    public string Username { get; set; }
    public string Email { get; set; }
    public virtual IEnumerable<ProjectEntity> Projects { get; set; }
    public virtual RoleEntity Role { get; set; }
    public string RoleId { get; set; }
}