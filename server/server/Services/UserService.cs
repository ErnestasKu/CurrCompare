using System.Security.Claims;

namespace server.Services
{
    public class UserService(IHttpContextAccessor httpContextAccessor)
    {
        // checks if id matches claim owner
        public void VerifyOwner(Guid requestId)
        {
            var user = httpContextAccessor.HttpContext?.User;
            var currentIdClaim = user?.FindFirstValue("id");

            if (currentIdClaim is null || currentIdClaim != requestId.ToString())
                throw new UnauthorizedAccessException("You do not have permission.");

        }
    }
}
