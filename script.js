const NEWS_API_KEY = "e2d193c3723e400c868352f0a7abf852";
const WEATHER_API_KEY = "4bf3fffabb9b1d411d7188b3ecb9ed01";

const newsUrl = "https://newsapi.org/v2/everything?q=";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${newsUrl}${query}&apiKey=${NEWS_API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

async function fetchWeather() {
    const city = document.getElementById("city").value;
    if (!city) return alert("Enter a city!");

    const res = await fetch(`${weatherUrl}${city}&appid=${WEATHER_API_KEY}&units=metric`);
    const data = await res.json();

    document.getElementById("temperature").innerHTML = `🌡 ${data.main.temp}°C`;
    document.getElementById("feels-like").innerHTML = `🥶 Feels like ${data.main.feels_like}°C`;
    document.getElementById("humidity").innerHTML = `💧 ${data.main.humidity}%`;
    document.getElementById("weather").innerHTML = `☁️ ${data.weather[0].description}`;
    document.getElementById("wind-speed").innerHTML = `🌬 Wind: ${data.wind.speed} m/s`;
}
