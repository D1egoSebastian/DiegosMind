namespace DiegosMind.API.DTOs
{
    public class PostResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public int? Rating { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool Published { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CategoryName { get; set; }
        public List<string>? Tags { get; set; }

    }
}
