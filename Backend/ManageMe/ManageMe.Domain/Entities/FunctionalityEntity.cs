using Catut;
using ManageMe.Domain.Abstractions;

namespace ManageMe.Domain.Entities;

// Stan (todo, doing, done)

public enum FunctionalityStatus
{
    Todo, Doing, Done
}

public class FunctionalityEntity : Entity
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    public string Description { get; set; }
    
    public int Priority { get; set; }
    
    public Guid ProjectId { get; set; }
    public virtual ProjectEntity Project { get; set; }
    
    public virtual AccountEntity? Owner { get; set; }
    public Guid? OwnerId { get; set; }
    
    public FunctionalityStatus Status { get; set; }

    public virtual IEnumerable<TaskItem> TaskItems { get; set; }
    
    private FunctionalityEntity() { }

    public static async Task<Result<FunctionalityEntity>> Create(string name, string description, int priority, Guid projectId, Guid? ownerId, FunctionalityStatus status)
    {
        return new FunctionalityEntity
        {
            Name = name,
            Description = description,
            Priority = priority,
            ProjectId = projectId,
            OwnerId = ownerId,
            Status = status
        };
    }
}