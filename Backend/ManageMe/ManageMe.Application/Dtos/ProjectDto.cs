namespace ManageMe.Application.Dtos;

public class ProjectDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

}