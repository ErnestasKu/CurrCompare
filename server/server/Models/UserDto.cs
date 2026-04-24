using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class UserDto
    {
        [MaxLength(30)]
        public string? Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(254)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        [MaxLength(128)]
        public string Password { get; set; } = string.Empty;
    }
}
