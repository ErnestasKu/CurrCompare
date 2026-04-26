using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class DashboardSettingsDto
    {
        [MaxLength(3)]
        public string? BaseCurrency { get; set; }
        public List<string>? Watchlist { get; set; } = [];
    }
}
