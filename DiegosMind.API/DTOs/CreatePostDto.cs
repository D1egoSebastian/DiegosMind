using DiegosMind.API.Models;
using System.ComponentModel.DataAnnotations;

namespace DiegosMind.API.DTOs
{
    public class CreatePostDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public int CategoryId { get; set; }
        public List<int>? TagIds { get; set; }
        public int? Rating { get; set; }
        public string Coverimageurl { get; set; }
        public bool Published { get; set; } = false;
    }
}
