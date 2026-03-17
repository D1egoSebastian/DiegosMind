using DiegosMind.API.Data;
using DiegosMind.API.DTOs;
using DiegosMind.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiegosMind.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TagsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            var TagList = await _context.Tags.ToListAsync();

            if (!TagList.Any()) { return NotFound(new { message = "no task found" }); }

            return Ok(TagList);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateTag([FromBody] CreateTagDto dto)
        {
            var TagFinder = await _context.Tags.FirstOrDefaultAsync(t => t.Name == dto.Name);

            if (TagFinder != null) { return BadRequest(new { message = "that task already exist" }); }

            var newTag = new Tag
            {
                Name = dto.Name
            };

            _context.Tags.Add(newTag);
            await _context.SaveChangesAsync();

            return Ok(new TagResponseDto
            {
                Name = newTag.Name
            });
        }
    }
}
