using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
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
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);
            if (user is null)
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

        // clear user token data in db
        public async Task RevokeTokenAsync(string refreshToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null) return;

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await context.SaveChangesAsync();
        }

        // get new token response (access + refresh) from refresh token
        public async Task<TokenResponseDto?> RefreshWithOnlyTokenAsync(string refreshToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;

            return await CreateTokenResponse(user);
        }

        public async Task<User?> RegisterAsync(UserDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            if (request.Username == null)
                throw new Exception("Username is required");

            if (await context.Users.AnyAsync(u => u.Email == normalizedEmail))
                throw new Exception("Email already exists");

            var user = new User();
            var hashedPassword = new PasswordHasher<User>()
                .HashPassword(user, request.Password);

            user.Username = request.Username;
            user.Email = normalizedEmail;
            user.PasswordHash = hashedPassword;
            user.LastLogin = DateTime.UtcNow;

            context.Users.Add(user);
            await context.SaveChangesAsync();

            // additional table creation ----------------------------------
            var dashboard = new DashboardSettings { UserId = user.Id };
            var crossRate = new CrossRateSettings { UserId = user.Id };

            context.DashboardSettings.Add(dashboard);
            context.CrossRateSettings.Add(crossRate);

            await context.SaveChangesAsync();

            return user;
        }

        // creates a new access token
        private string CreateToken(User user)
        {
            var claims = new List<Claim> {
                new("username", user.Username),
                new("id", user.Id.ToString()),
                new("role", user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
                );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        // generates 32 byte random refresh token string
        private static string GenerateRefreshToken()
        {
            var rand = new Byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(rand);
            return Base64UrlTextEncoder.Encode(rand);
        }

        // create + save refresh token to db
        private async Task<string> GenerateSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }
    }
}
