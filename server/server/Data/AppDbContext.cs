using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserDashboardSettings> UserDashboardSettings { get; set; }
        public DbSet<UserCrossRateSettings> UserCrossRateSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<UserCrossRateSettings>()
                .Property(s => s.DefaultAmount)
                .HasPrecision(18, 8);

            modelBuilder.Entity<UserDashboardSettings>()
                .HasIndex(s => s.UserId)
                .IsUnique();

            modelBuilder.Entity<UserCrossRateSettings>()
                .HasIndex(s => s.UserId)
                .IsUnique();
        }
    }
}
