using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Range(0, 9_999_999_999)]
        public decimal? DefaultAmount { get; set; }

        [Required]
        public List<string> SelectedCurrencies { get; set; } = [];

    }
}
