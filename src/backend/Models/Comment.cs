using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace ProjectName.Models
{

    [Table("comment")]
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int ID { get; set; }
        [Column("text", TypeName = "varchar(30)")]
        [Display(Name = "Text")]
        public string Text { get; set; } = "";
        [Column("created_at", TypeName = "datetime")]
        [Display(Name = "Created At")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        [Column("post_id")]
        public int PostID { get; set; }

        [ForeignKey(nameof(PostID))]
        [ValidateNever]
        public virtual Post Post { get; set; }
        [Column("author", TypeName = "varchar(30)")]
        [Display(Name = "Author")]
        public string Author { get; set; } = "";

        // [Column("user_id")]
        // public string? UserID { get; set; }

        // [ForeignKey(nameof(UserID))]
        // [ValidateNever]
        // public virtual User User { get; set; }
    }
}