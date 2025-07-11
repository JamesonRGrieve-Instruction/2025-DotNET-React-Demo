using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
namespace ProjectName.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        public static List<Comment> comments = new List<Comment>();
        [HttpPost("")]
        public ActionResult<Comment> CreateComment(string text, string author, int postID)
        {
            Comment comment = new Comment()
            {
                Text = text,
                Author = author,
                PostID = postID
            };
            comments.Add(comment);
            return comment;
        }
        [HttpGet("{id}")]
        public ActionResult<Comment> GetComment(string id)
        {
            return comments.Find(comment => comment.ID.ToString() == id);
        }
        [HttpGet("")]
        public ActionResult<IEnumerable<Comment>> ListComments([FromQuery] string? search, [FromQuery] string? reverseOrder, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            IEnumerable<Comment> result = string.IsNullOrWhiteSpace(search) ? comments : comments.Where(comment => comment.Text.Contains(search) || comment.Author.Contains(search));
            return (reverseOrder ?? "").Trim() == "true" ? result.OrderByDescending(comment => comment.Text).ToList() : result.OrderBy(comment => comment.Text).Skip((pageSize * (page - 1)) ?? 0).Take(pageSize ?? 100).ToList();
        }
        [HttpPut("{id}")]
        public ActionResult<Comment> PutComment(string id, string text, string author, int postID)
        {
            Comment target = comments.Find(comment => comment.ID.ToString() == id);
            target.Text = text;
            target.Author = author;
            target.PostID = postID;
            return target;
        }
        [HttpDelete("{id}")]
        public ActionResult DeleteComment(string id)
        {
            comments.Remove(comments.Find(comment => comment.ID.ToString() == id));
            return NoContent();
        }

    }
}