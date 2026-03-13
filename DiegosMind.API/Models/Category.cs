namespace DiegosMind.API.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }

        public List<Posts>? Posts { get; set; }
    }
}
