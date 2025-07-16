using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IJwtService _jwtService;

        public AuthController(IJwtService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (ValidateUser(request.Email, request.Password))
            {
                var token = _jwtService.GenerateToken(
                    userId: "12345",
                    email: request.Email,
                    roles: new[] { "User" }
                );

                return Ok(new LoginResponse
                {
                    Token = token,
                    Message = "Login successful"
                });
            }

            return Unauthorized(new { Message = "Invalid credentials" });
        }

        private bool ValidateUser(string email, string password)
        {
            return email == "test@example.com" && password == "password123";
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}