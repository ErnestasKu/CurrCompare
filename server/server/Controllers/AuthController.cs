using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Entities;
using server.Models;
using server.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<TokenResponseDto>> Register(UserDto request)
        {
            try
            {
                var user = await authService.RegisterAsync(request);

                if (user is null)
                    return BadRequest("An unexpected error occurred during registration");


                TokenResponseDto tokenResponse = await authService.CreateTokenResponse(user);
                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(UserDto request)
        {
            var res = await authService.LoginAsync(request);
            if (res is null)
                return BadRequest("Invalid email or password");

            return Ok(res);
        }

        [HttpPost(("refresh-token"))]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokensAsync(request);
            if (result is null ||
                result.AccessToken is null ||
                result.RefreshToken is null)
                return Unauthorized("Invalid refresh token");

            return Ok(result);
        }

        [Authorize]
        [HttpGet("auth")]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated");
        }

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpGet("admin")]
        public IActionResult AdminOnlyEndpoint()
        {
            return Ok("You are an Admin");
        }

        //[HttpGet("aaa")]
        //public IActionResult aaa()
        //{
        //    return Ok("AAAAAAAA AAAAAAAAAA AAAAAAAA");
        //}
    }

}
