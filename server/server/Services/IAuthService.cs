using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task RevokeTokenAsync(string refreshToken);
        Task<TokenResponseDto?> RefreshWithOnlyTokenAsync(string refreshToken);
        Task<TokenResponseDto> CreateTokenResponse(User user);

    }
}
