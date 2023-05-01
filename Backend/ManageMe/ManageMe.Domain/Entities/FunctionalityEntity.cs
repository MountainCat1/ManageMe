﻿using ManageMe.Domain.Abstractions;

namespace ManageMe.Domain.Entities;

public class FunctionalityEntity : Entity
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    public string Description { get; set; }
    
    public int Priority { get; set; }
    
    public string ProjectId { get; set; }
    public virtual ProjectEntity Project { get; set; }
    
    public virtual AccountEntity Owner { get; set; }
    public string OwnerId { get; set; }
    
    public string Status { get; set; }

    public virtual IEnumerable<TaskItem> TaskItems { get; set; }
    
    private FunctionalityEntity() { }

    public static FunctionalityEntity Create(string name, string description, int priority, string projectId, string ownerId, string status)
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