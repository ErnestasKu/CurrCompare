using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(AppDbContext context) : ControllerBase
    {
        // returns all users
        [HttpGet("{userId:guid}")]
        public async Task<ActionResult<UserInfoDto>> GetUserInfo(Guid userId)
        {
            if (userId == Guid.Empty)
                return BadRequest(new { message = "Id is empty" });

            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user is null)
                return NotFound(new { message = "User not found" });

            UserInfoDto userInfoDto = new UserInfoDto()
            {
                Id = userId,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin,
            };

            return Ok(userInfoDto);
        }
    }
}
