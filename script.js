// Your API Keys
const NEWS_API_KEY = "e2d193c3723e400c868352f0a7abf852";
const WEATHER_API_KEY = "4bf3fffabb9b1d411d7188b3ecb9ed01";

// Use a CORS proxy for NewsAPI calls
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
// Use the proper NewsAPI endpoint (using HTTPS)
const newsUrl = "https://newsapi.org/v2/everything?q=";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// On load, fetch news about India
window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

// FETCH NEWS USING A CORS PROXY
async function fetchNews(query) {
  try {
    // Encode query to ensure special characters are handled correctly
    const fullUrl =
      proxyUrl +
      newsUrl +
      encodeURIComponent(query) +
      "&apiKey=" +
      NEWS_API_KEY;
      
    const response = await fetch(fullUrl, {
      // Optionally add headers if required by the proxy
      headers: {
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    
    // Check if the response status is OK
    if (!response.ok) {
      console.error("News API error, status:", response.status);
      throw new Error("News API response not ok: " + response.status);
    }
    
    const data = await response.json();
    console.log("News API response:", data);
    
    if (!data.articles) {
      throw new Error("No articles found in the API response.");
    }
    
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    alert("Error fetching news. Please try again later.");
  }
}

// BIND NEWS ARTICLES TO THE DOM
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");
  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    // Skip articles with no image
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Fill in the details of a news card
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsDesc = cardClone.querySelector("#news-desc");
  const newsSource = cardClone.querySelector("#news-source");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description || "";
  
  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Event listener for the search button
document.getElementById("search-button").addEventListener("click", () => {
  const query = document.getElementById("search-text").value;
  if (!query) return;
  fetchNews(query);
});

// FETCH WEATHER INFORMATION
async function fetchWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city!");
    return;
  }

  try {
    // Build the weather API URL using HTTPS and encode the city name
    const res = await fetch(
      `${weatherUrl}${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!res.ok) {
      throw new Error("Weather API response not ok: " + res.status);
    }

    const data = await res.json();

    // Update weather details in the DOM
    document.getElementById("temperature").innerHTML = `🌡 Temperature: ${data.main.temp}°C`;
    document.getElementById("feels-like").innerHTML = `🥶 Feels like: ${data.main.feels_like}°C`;
    document.getElementById("humidity").innerHTML = `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("weather").innerHTML = `☁️ ${data.weather[0].description}`;
    document.getElementById("wind-speed").innerHTML = `🌬 Wind: ${data.wind.speed} m/s`;

    // If available, add sunrise and sunset times
    if (data.sys && data.sys.sunrise && data.sys.sunset) {
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
