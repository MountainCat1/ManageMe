using Catut;
using ManageMe.Domain.Abstractions;

namespace ManageMe.Domain.Entities;


public class ProjectEntity : Entity
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    public string Description { get; set; }
    
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    
    public virtual IEnumerable<AccountEntity> Members { get; set; }
    public virtual IEnumerable<FunctionalityEntity> Funcionalities { get; set; }

    public TimeSpan EstimatedTime => GetEstimatedTime();
    public int WorkHourDone => GetWorkHourDone();

    private ProjectEntity(){}
    
    public static Task<Result<ProjectEntity>> Create(string name, DateTime startTime)
    {
        var entity = new ProjectEntity()
        {
            Name = name,
            StartTime = startTime
        };

        return Task.FromResult<Result<ProjectEntity>>(entity);
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