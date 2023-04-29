using System.ComponentModel.DataAnnotations;
using ManageMe.Domain.Abstractions;

namespace ManageMe.Domain.Entities;

public class ProjectEntity : Entity
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    
    public virtual IEnumerable<AccountEntity> Members { get; set; }

    public TimeSpan EstimatedTime => GetEstimatedTime();
    public int WorkHourDone => GetWorkHourDone();

    private ProjectEntity(){}
    
    public static ProjectEntity Create(string name, DateTime startTime)
    {
        var entity = new ProjectEntity()
        {
            Name = name,
            StartTime = startTime
        };

        return entity;
    }
    
    private int GetWorkHourDone()
    {
        throw new NotImplementedException();
    }
    
    private TimeSpan GetEstimatedTime()
    {
        throw new NotImplementedException();
    }
}