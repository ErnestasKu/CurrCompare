using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Entities;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Services
{
    public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService
    {
        public async Task<TokenResponseDto?> LoginAsync(UserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                throw new Exception("Email not in use");

            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
                throw new Exception("Incorrect password.");

            user.LastLogin = DateTime.UtcNow;
            await context.SaveChangesAsync();

            return await CreateTokenResponse(user);
        }

        public async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto()
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateSaveRefreshTokenAsync(user)
            };
        }
        public async Task RevokeTokenAsync(string refreshToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null) return;

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await context.SaveChangesAsync();
        }

        public async Task<TokenResponseDto?> RefreshWithOnlyTokenAsync(string refreshToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;

            return await CreateTokenResponse(user);
        }

        public async Task<User?> RegisterAsync(UserDto request)
        {
            if (request.Username == null)
                throw new Exception("Username is required");

            if (await context.Users.AnyAsync(u => u.Email == request.Email))
                throw new Exception("Email already exists");

            var user = new User();
            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);

            user.Username = request.Username;
            user.Email = request.Email;
            user.PasswordHash = hashedPassword;

            context.Users.Add(user);
            await context.SaveChangesAsync();

            // additional table creation ----------------------------------
            var dashboard = new UserDashboardSettings { UserId = user.Id };
            var crossRate = new UserCrossRateSettings { UserId = user.Id };

            context.UserDashboardSettings.Add(dashboard);
            context.UserCrossRateSettings.Add(crossRate);

            await context.SaveChangesAsync();

            return user;
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim> {
                new Claim("username", user.Username),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        private string GenerateRefreshToken()
        {
            var rand = new Byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(rand);
            return Convert.ToBase64String(rand);
        }

        private async Task<string> GenerateSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }

        private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null ||
                user.RefreshToken != refreshToken ||
                user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            return user;
        }
    }
}
