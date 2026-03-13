namespace DiegosMind.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime Created_at { get; set; }

        public List<Posts>? Posts { get; set; }

    }
}
