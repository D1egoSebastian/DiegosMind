using DiegosMind.API.Data;
using DiegosMind.API.DTOs;
using DiegosMind.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DiegosMind.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var emailexist = await _context.Users.AnyAsync(x => x.Email == dto.EmailAddress);

            if(emailexist)
            {
                return BadRequest(new { message = "that email already exists" });
            }

            var newUser = new User
            {
                Name = dto.Name,
                Email = dto.EmailAddress,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Created(string.Empty, new
            {
                id = newUser.Id,
                name = dto.Name,
                email = dto.EmailAddress
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var EmailRegisterToUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if(EmailRegisterToUser == null)
            {
                return Unauthorized();
            }

            var verifyPassword = BCrypt.Net.BCrypt.Verify(dto.Password, EmailRegisterToUser.PasswordHash);

            if (!verifyPassword)
            {
                return Unauthorized();
            }

            var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, EmailRegisterToUser.Id.ToString()),
            new Claim(ClaimTypes.Email, EmailRegisterToUser.Email),
            new Claim(ClaimTypes.Name, EmailRegisterToUser.Name)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: credentials
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }
    }
}
