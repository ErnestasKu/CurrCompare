using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Entities;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CrossRateController(AppDbContext context, UserService userService) : ControllerBase
    {
        [HttpGet("settings/{userId:guid}")]
        public async Task<ActionResult<CrossRateSettingsDto>> GetSettings(Guid userId)
        {
            try { userService.VerifyOwner(userId); }
            catch (Exception ex) { return Forbid(ex.Message); }

            var settings = await context.CrossRateSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings is null)
                return NotFound();

            var settingsDto = new CrossRateSettingsDto
            {
                DefaultAmount = settings.DefaultAmount,
                SelectedCurrencies = settings.SelectedCurrencies,
            };

            return Ok(settingsDto);
        }

        // updates/creates new crossrates settings
        [HttpPut("settings/{userId:guid}")]
        public async Task<ActionResult> UpdateSettings(Guid userId, [FromBody] CrossRateSettingsDto crossRateSettingsDto)
        {
            try { userService.VerifyOwner(userId); }
            catch (Exception ex) { return Forbid(ex.Message); }

            var settings = await context.CrossRateSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings is null)
            {
                settings = new CrossRateSettings()
                {
                    UserId = userId,
                    DefaultAmount = crossRateSettingsDto.DefaultAmount,
                    SelectedCurrencies = crossRateSettingsDto.SelectedCurrencies ?? [],
                };
                context.CrossRateSettings.Add(settings);
            }
            else
            {
                settings.DefaultAmount = crossRateSettingsDto.DefaultAmount;
                settings.SelectedCurrencies = crossRateSettingsDto.SelectedCurrencies ?? [];
                context.CrossRateSettings.Update(settings);
            }

            await context.SaveChangesAsync();
            return NoContent();
        }
    }

}