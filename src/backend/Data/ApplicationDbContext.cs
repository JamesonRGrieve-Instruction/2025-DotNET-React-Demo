using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjectName.Models;
namespace ProjectName.Data
{

    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }


        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Comment>(entity => // A Person
            {
                entity.HasOne(child => child.Post) // Has One Job
                    .WithMany(parent => parent.Comments) // With Many People
                    .HasForeignKey(child => child.PostID)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName($"FK_{nameof(Comment)}_{nameof(Post)}");

                entity.HasIndex(entity => entity.PostID)
                    .HasDatabaseName($"FK_{nameof(Comment)}_{nameof(Post)}");

            });

            base.OnModelCreating(modelBuilder);
        }
    }
}