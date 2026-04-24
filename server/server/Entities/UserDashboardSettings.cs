using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class UserDashboardSettings
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [MaxLength(3)]
        public string? BaseCurrency { get; set; }

        [Required]
        public List<string> Watchlist { get; set; } = new();
    }
}
