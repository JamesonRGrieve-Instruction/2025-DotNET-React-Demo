using Microsoft.AspNetCore.Mvc;
using ProjectName.Models;
namespace ProjectName.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        public static List<Post> posts = new List<Post>();
        [HttpPost("")]
        public ActionResult<Post> CreatePost(string title, string content, string userID)
        {
            Post post = new Post()
            {
                Title = title,
                Content = content,
                // UserID = userID
            };
            posts.Add(post);
            return post;
        }
        [HttpGet("{id}")]
        public ActionResult<Post> GetPost(string id)
        {
            return posts.Find(post => post.ID.ToString() == id);
        }
        [HttpGet("")]
        public ActionResult<IEnumerable<Post>> ListPosts([FromQuery] string? search, [FromQuery] string? reverseOrder, [FromQuery] int? page, [FromQuery] int? pageSize)
        {
            IEnumerable<Post> result = string.IsNullOrWhiteSpace(search) ? posts : posts.Where(post => post.Title.Contains(search) || post.Content.Contains(search));
            return (reverseOrder ?? "").Trim() == "true" ? result.OrderByDescending(post => post.Title).ToList() : result.OrderBy(post => post.Title).Skip((pageSize * (page - 1)) ?? 0).Take(pageSize ?? 100).ToList();
        }
        [HttpPut("{id}")]
        public ActionResult<Post> PutPost(string id, string title, string content, string userID)
        {
            Post target = posts.Find(post => post.ID.ToString() == id);
            target.Title = title;
            target.Content = content;
            // target.UserID = userID;
            return target;
        }
        [HttpDelete("{id}")]
        public ActionResult DeletePost(string id)
        {
            posts.Remove(posts.Find(post => post.ID.ToString() == id));
            return NoContent();
        }

    }
}