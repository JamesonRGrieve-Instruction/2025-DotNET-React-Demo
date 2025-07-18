using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;


namespace YourApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;

        public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration, IJwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = _signInManager;
            _configuration = configuration;
            _jwtService = jwtService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CredentialRequest request)
        {
            if (request == null)
            {
                return BadRequest("No credentials provided.");
            }
            var temp = await _userManager.CreateAsync(new IdentityUser { Email = request.Email, UserName = request.Email.Split("@")[0] }, request.Password);
            if (temp.Succeeded)
            {
                return NoContent();
            }
            return BadRequest("Invalid registration request.");
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] CredentialRequest request)
        {
            if (request == null)
            {
                return BadRequest("No credentials provided.");
            }
            IdentityUser? user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return BadRequest("Invalid credentials provided.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user.Id, user.Email!, roles);

            return Ok(new { Token = token });

        }

    }

    public class CredentialRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

}