using DiegosMind.API.Data;
using DiegosMind.API.DTOs;
using DiegosMind.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiegosMind.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categorieslist = await _context.Categories.ToListAsync();

            if (!categorieslist.Any()) { return NotFound(new { message = "no categories found" }); }

            return Ok(categorieslist);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            var categoryfinder = await _context.Categories.FirstOrDefaultAsync(x => x.Name == dto.Name);

            if (categoryfinder != null) { return BadRequest(new { message = "that category already exist." }); }

            var newCategory = new Category
            {
                Name = dto.Name,
                Slug = dto.Slug,
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            return Ok( new CategoryResponseDto
            {
                Name = newCategory.Name,
                Slug = newCategory.Slug,
            });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var categoryfinder = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id);

            if (categoryfinder == null) { return NotFound(new { message = "no categories found" }); }

            _context.Categories.Remove(categoryfinder);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
