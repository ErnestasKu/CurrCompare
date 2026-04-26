using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController(AppDbContext context, UserService userService) : ControllerBase
    {
        [HttpGet("settings/{userId:guid}")]
        public async Task<ActionResult<DashboardSettingsDto>> GetSettings(Guid userId)
        {
            try { userService.VerifyOwner(userId); }
            catch (Exception ex) { return Forbid(ex.Message); }

            var settings = await context.DashboardSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings is null)
                return NotFound();

            var settingsDto = new DashboardSettingsDto
            {
                BaseCurrency = settings.BaseCurrency,
                Watchlist = settings.Watchlist,
            };

            return Ok(settingsDto);
        }

        // updates/creates new dashboards settings
        [HttpPut("settings/{userId:guid}")]
        public async Task<ActionResult> UpdateSettings(Guid userId, [FromBody] DashboardSettingsDto dashboardSettingsDto)
        {
            try { userService.VerifyOwner(userId); }
            catch (Exception ex) { return Forbid(ex.Message); }

            var settings = await context.DashboardSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings is null)
            {
                settings = new DashboardSettings
                {
                    UserId = userId,
                    BaseCurrency = dashboardSettingsDto.BaseCurrency,
                    Watchlist = dashboardSettingsDto.Watchlist ?? []
                };
                context.DashboardSettings.Add(settings);
            }
            else
            {
                settings.BaseCurrency = dashboardSettingsDto.BaseCurrency;
                settings.Watchlist = dashboardSettingsDto.Watchlist ?? [];
                context.DashboardSettings.Update(settings);
            }

            await context.SaveChangesAsync();
            return NoContent();
        }
    }

}