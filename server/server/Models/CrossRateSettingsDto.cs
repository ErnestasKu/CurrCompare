using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class CrossRateSettingsDto
    {
        [Range(0, 1_000_000_000_000)]
        public decimal? DefaultAmount { get; set; }
        public List<string>? SelectedCurrencies { get; set; } = [];
    }
}
