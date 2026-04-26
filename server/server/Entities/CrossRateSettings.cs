using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace server.Entities
{
    public class CrossRateSettings
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }

        [Range(0, 1_000_000_000_000)]
        public decimal? DefaultAmount { get; set; }

        [Required]
        public List<string> SelectedCurrencies { get; set; } = [];

    }
}
