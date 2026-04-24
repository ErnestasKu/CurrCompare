using server.Entities;

namespace server.Models
{
    public class UserInfoDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}
