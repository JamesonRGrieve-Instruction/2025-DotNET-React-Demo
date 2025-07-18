using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class JokeController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public JokeController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpGet("")]
        public async Task<ActionResult<string>> GetJoke()
        {
            var response = await _httpClient.GetAsync("https://api.chucknorris.io/jokes/random");

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, response.Content.ToString());
            }

            return Ok(JsonDocument.Parse(await response.Content.ReadAsStringAsync()).RootElement.GetProperty("value").GetString());
        }
    }
}
