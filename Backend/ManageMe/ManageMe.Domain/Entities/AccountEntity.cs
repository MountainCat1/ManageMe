using ManageMe.Domain.Abstractions;
using ManageMe.Domain.DomainEvents;

namespace ManageMe.Domain.Entities;

public abstract class AccountEntity : Entity
{
    protected AccountEntity(string email, string username, string name, string surname)
    {
        Username = username;
        Email = email;
        Name = name;
        Surname = surname;
        
        RoleId = "Developer";
        
        AddDomainEvent(new CreateAccountDomainEvent());
    }

    public Guid Id { get; set; }

    public string Username { get; set; }
    public string Email { get; set; }
    
    public string Name { get; set; }
    public string Surname { get; set; }
    public virtual RoleEntity Role { get; set; }
    public string RoleId { get; set; }
    
    public virtual IEnumerable<FunctionalityEntity> Functionalities { get; set; }
    public virtual IEnumerable<ProjectEntity> Projects { get; set; }
    public virtual IEnumerable<TaskItem> TaskItems { get; set; }
}