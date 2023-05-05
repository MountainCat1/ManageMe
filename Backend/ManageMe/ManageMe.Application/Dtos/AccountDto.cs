namespace ManageMe.Application.Dtos;

public class AccountDto
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Username { get; set; }
    public RoleDto Role { get; set; }
}