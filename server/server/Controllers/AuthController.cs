using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(UserDto request)
        {
            try
            {
                var user = await authService.RegisterAsync(request);
                if (user is null)
                    return BadRequest("Error during registration");

                var result = await authService.CreateTokenResponse(user);
                SetRefreshTokenCookie(result.RefreshToken);
                return Ok(new { accessToken = result.AccessToken });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(UserDto request)
        {
            try
            {
                var res = await authService.LoginAsync(request);
                if (res is null)
                    return BadRequest("Invalid email or password");

                SetRefreshTokenCookie(res.RefreshToken);
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // get a new access token from cookies
        [HttpPost(("refresh-token"))]
        public async Task<ActionResult> RefreshToken()
        {
            // get token from cookie
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("No refresh token provided");

            // verify
            var result = await authService.RefreshWithOnlyTokenAsync(refreshToken);
            if (result is null)
                return Unauthorized("Invalid refresh token");

            // update cookie, send new access token
            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(new { accessToken = result.AccessToken });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (!string.IsNullOrEmpty(refreshToken))
                await authService.RevokeTokenAsync(refreshToken);

            Response.Cookies.Delete("refreshToken");

            return Ok();
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }

}
