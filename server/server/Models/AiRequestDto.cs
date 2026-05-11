using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class AiRequestDto
    {
        [Required]
        [MaxLength(3)]
        public string BaseCurrency { get; set; } = string.Empty;

        [Required]
        [MaxLength(3)]
        public string TargetCurrency { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public required StatsDto Stats { get; set; }
    }

    public class StatsDto
    {
        [Required]
        public decimal Max { get; set; }

        [Required]
        public decimal Min { get; set; }

        [Required]
        public decimal Change { get; set; }

        [Required]
        public decimal Current { get; set; }
    }
}
