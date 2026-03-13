using System.ComponentModel.DataAnnotations; 

namespace DiegosMind.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
