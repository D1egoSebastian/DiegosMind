using DiegosMind.API.Data;
using DiegosMind.API.DTOs;
using DiegosMind.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DiegosMind.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]

        public async Task<IActionResult> GetPosts()
        {
            var findpost = await _context.Posts
                .Include(c => c.Category)
                .Include(p => p.PostTags)
                .ThenInclude(p => p.Tag)
                .Where(x => x.Published == true).ToListAsync();

            if (findpost == null)
            {
                return NotFound(new { message = "no posts!" });
            }

            return Ok(findpost.Select(p => new PostResponseDto
            {
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                Slug = p.Slug,
                Rating = p.Rating,
                Published = p.Published,
                CoverImageUrl = p.Coverimageurl,
                CreatedAt = p.CreatedAt,
                CategoryName = p.Category.Name,
                Tags = p.PostTags?.Select(pt => pt.Tag?.Name).ToList()
            }));
        }

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetPostBySlug(string slug)
        {
            var findpostslug = await _context.Posts
                .Include(c => c.Category)
                .Include(p => p.PostTags)
                .ThenInclude(p => p.Tag)
                .FirstOrDefaultAsync(x => x.Slug == slug);

            if (findpostslug == null)
            {
                return NotFound(new { message = "no post with that slug" });
            }

            return Ok(new PostResponseDto
            {
                Id = findpostslug.Id,
                Title = findpostslug.Title,
                Content = findpostslug.Content,
                Slug = findpostslug.Slug,
                Rating = findpostslug.Rating,
                Published = findpostslug.Published,
                CoverImageUrl = findpostslug.Coverimageurl,
                CreatedAt = findpostslug.CreatedAt,
                CategoryName = findpostslug.Category?.Name,
                Tags = findpostslug.PostTags?.Select(pt => pt.Tag?.Name).ToList()
            });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var categoryexist = await _context.Categories.FirstOrDefaultAsync(x => x.Id == dto.CategoryId);
            if (categoryexist == null)
            {
                return NotFound(new { message = "that category dont exist!" });
            }

            var slugs = dto.Title
                .ToLower()
                .Replace(" ", "-")
                .Replace("á", "a").Replace("é", "e")
                .Replace("í", "i").Replace("ó", "o")
                .Replace("ú", "u");

            //var newPostTags = new PostTag
            //{
            //    TagId = dto.TagIds
            //};

            var newPost = new Posts
            {
                Title = dto.Title,
                Content = dto.Content,
                CategoryId = dto.CategoryId,
                Rating = (int)dto.Rating,
                Coverimageurl = dto.Coverimageurl,
                Published = true,
                Slug = slugs,        
                UserId = userId,
                PostTags = dto.TagIds?.Select(tagId => new PostTag
                {
                    TagId = tagId,
                }).ToList(),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,

            };

            _context.Posts.Add(newPost);
            await _context.SaveChangesAsync();

            return Ok(new PostResponseDto
            {
                Id = newPost.Id,
                Title = newPost.Title,
                Content = newPost.Content,
                Slug = newPost.Slug,
                Rating = newPost.Rating,
                Published = newPost.Published,
                CoverImageUrl = newPost.Coverimageurl,
                CreatedAt = newPost.CreatedAt,
                CategoryName = categoryexist.Name
            });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] CreatePostDto dto)
        {
            var findPost = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            if (findPost == null) { return NotFound(new { message = "that post dont exist!" }); } ;

            findPost.Title = dto.Title;
            findPost.Content = dto.Content;
            findPost.CategoryId = dto.CategoryId;
            findPost.Rating = (int)dto.Rating;
            findPost.Coverimageurl = dto.Coverimageurl;
            findPost.PostTags = dto.TagIds?.Select(tagId => new PostTag
            {
                TagId = tagId,
            }).ToList();
          
            findPost.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(findPost);

        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost(int id)
        {
            var findPost = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);

            if (findPost == null) { return NotFound(new { message = "that post dont exist!" }); }
            ;

            _context.Posts.Remove(findPost);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    } }
