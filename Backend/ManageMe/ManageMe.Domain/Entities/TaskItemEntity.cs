namespace ManageMe.Domain.Entities;

public enum TaskState
{
    Todo,
    Doing,
    Done
}

public class TaskItem
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    public string Description { get; set; }
    public int Priority { get; set; }
    public int EstimatedTime { get; set; }
    public TaskState State { get; set; }
    public DateTime AddedDate { get; set; }
    public DateTime? StartedDate { get; set; }
    public DateTime? CompletedDate { get; set; }


    public Guid AssignedUserId { get; set; }
    public virtual AccountEntity AssignedUser { get; set; }

    public Guid FunctionalityId { get; set; }
    public virtual FunctionalityEntity Functionality { get; set; }

    private TaskItem(string name, string description, int priority, Guid functionalityId, int estimatedTime,
        DateTime? startedDate, DateTime? completedDate)
    {
        Name = name;
        Description = description;
        Priority = priority;
        FunctionalityId = functionalityId;
        EstimatedTime = estimatedTime;
        StartedDate = startedDate;
        CompletedDate = completedDate;
    }

    public static TaskItem Create(string name, string description, int priority, Guid functionality,
        int estimatedTime, DateTime? startedDate, DateTime? completedDate)
    {
        var newEntity = new TaskItem(name, description, priority, functionality, estimatedTime, startedDate,
            completedDate)
        {
            AddedDate = DateTime.Now,
            State = TaskState.Todo
        };

        return newEntity;
    }
}