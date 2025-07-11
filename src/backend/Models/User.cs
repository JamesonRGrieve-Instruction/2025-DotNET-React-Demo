// using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

// namespace ProjectName.Models
// {

//     [Table("user")]
//     public class User
//     {
//         [Key]
//         [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
//         [Column("id")]
//         public int ID { get; set; }
//         [Column("user_name", TypeName = "varchar(30)")]
//         [Display(Name = "User Name")]
//         public string UserName { get; set; } = "";
//         [Column("email", TypeName = "varchar(30)")]
//         [Display(Name = "E-Mail")]
//         public string EMail { get; set; } = "";


//         // [InverseProperty(nameof(Post.User))]
//         // [ValidateNever]
//         // public virtual ICollection<Post> Posts { get; set; }
//     }
// }