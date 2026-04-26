using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Models;

namespace server.Controllers
{
    [Authorize(Roles = nameof(UserRole.Admin))]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController(AppDbContext context) : ControllerBase
    {
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserInfoDto>>> GetAllUsers()
        {
            var users = await context.Users
                .Select(u => new UserInfoDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    LastLogin = u.LastLogin
                }).ToListAsync();

            return Ok(users);
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateRole([FromRoute] Guid id, [FromBody] UserRole newRole)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            user.Role = newRole;
            await context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return NoContent();
        }

    }
}
