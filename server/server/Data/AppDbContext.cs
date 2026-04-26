using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<DashboardSettings> DashboardSettings { get; set; }
        public DbSet<CrossRateSettings> CrossRateSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // UserCrossRateSettings --------------------
            modelBuilder.Entity<CrossRateSettings>()
                .Property(s => s.DefaultAmount)
                .HasPrecision(18, 8);

            modelBuilder.Entity<CrossRateSettings>()
                .HasOne(s => s.User)
                .WithOne(u => u.CrossRateSettings)
                .HasForeignKey<CrossRateSettings>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CrossRateSettings>()
                .Property(e => e.SelectedCurrencies)
                .HasColumnType("text[]");

            // UserDashboardSettings --------------------
            modelBuilder.Entity<DashboardSettings>()
                .HasOne(s => s.User)
                .WithOne(u => u.DashboardSettings)
                .HasForeignKey<DashboardSettings>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DashboardSettings>()
                .Property(e => e.Watchlist)
                .HasColumnType("text[]");
        }
    }
}
