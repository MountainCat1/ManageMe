using ManageMe.Domain.Abstractions;

namespace ManageMe.Domain.Entities;

public class RoleEntity : Entity
{
    public string Name { get; set; }
    public virtual IEnumerable<AccountEntity> Accounts { get; set; }

    private RoleEntity()
    {
    }
    
    public static RoleEntity Create(string name)
    {
        var createdEntity = new RoleEntity()
        {
            Name = name
        };
        return createdEntity;
    }
}