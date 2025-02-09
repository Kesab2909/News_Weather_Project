// Replace "YOUR_GNEWS_API_KEY" with your actual GNews API key from gnews.io
const GNEWS_API_KEY = "fddf04eadeeb52a96e477912e6e3d3b9";
const WEATHER_API_KEY = "4bf3fffabb9b1d411d7188b3ecb9ed01";

// GNews endpoint for search; this returns up to 10 articles in English
const gnewsUrl = "https://gnews.io/api/v4/search?lang=en&max=10&q=";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// On load, fetch news about India.
window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const fullUrl = gnewsUrl + encodeURIComponent(query) + "&token=" + GNEWS_API_KEY;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.error("News API error, status:", response.status, await response.text());
      throw new Error("News API response not ok: " + response.status);
    }
    const data = await response.json();
    console.log("News API response:", data);
    if (!data.articles) {
      throw new Error("No articles found in the API response: " + JSON.stringify(data));
    }
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    alert("Error fetching news. Please try again later.");
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");
  cardsContainer.innerHTML = "";
  articles.forEach((article) => {
    // GNews returns the image in the "image" field.
    if (!article.image) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsDesc = cardClone.querySelector("#news-desc");
  const newsSource = cardClone.querySelector("#news-source");
  
  newsImg.src = article.image;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description || "";
  
  const publishedAt = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  newsSource.innerHTML = `${article.source.name} · ${publishedAt}`;
  
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Search button event listener
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-text").value;
  if (!query) return;
  fetchNews(query);
});

// WEATHER FUNCTIONALITY
async function fetchWeather() {
  const city = document.getElementById("city").value;
  if (!city) return alert("Please enter a city!");

  try {
    const res = await fetch(`${weatherUrl}${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`);
    if (!res.ok) {
      throw new Error("Weather API response not ok: " + res.status);
    }
    const data = await res.json();

    document.getElementById("temperature").innerHTML = `🌡 Temperature: ${data.main.temp}°C`;
    document.getElementById("feels-like").innerHTML = `🥶 Feels like: ${data.main.feels_like}°C`;
    document.getElementById("humidity").innerHTML = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("weather").innerHTML = `☁️ ${data.weather[0].description}`;
    document.getElementById("wind-speed").innerHTML = `🌬 Wind: ${data.wind.speed} m/s`;
    
    if (data.sys) {
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      document.getElementById("sunrise").innerHTML = `🌅 Sunrise: ${sunrise}`;
      document.getElementById("sunset").innerHTML = `🌇 Sunset: ${sunset}`;
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Error fetching weather. Please check the city name and try again.");
  }
}
