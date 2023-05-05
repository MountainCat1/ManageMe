using ManageMe.Domain.Entities;

namespace ManageMe.Application.Dtos;

public class FunctionalityDto
{
    public Guid Id { get; set; }
    
    public string Name { get; set; }
    public string Description { get; set; }
    
    public int Priority { get; set; }
    
    public Guid ProjectId { get; set; }
    
    public Guid? OwnerId { get; set; }
    
    public FunctionalityStatus Status { get; set; }

}