namespace DiegosMind.API.Models
{
    public class Posts
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int Rating { get; set; }
        public string Coverimageurl { get; set; }
        public bool Published { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Updated_at { get;set; }

        public List<PostTag>? PostTags { get; set; }
    }
}
