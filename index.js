const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");

const grantaccess = document.querySelector(".grant-location-access");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");

//initailly neede variables
let currenttab = usertab;
const API_KEY = "17b7d11be8e743e4a0b9b52632ae219f";
currenttab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(clickedtab){
    if(clickedtab!=currenttab){ 
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        currenttab.classList.add("current-tab");
        if(!searchform.classList.contains("active")){
            userinfocontainer.classList.remove("active");
            grantaccess.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            getfromsessionstorage();
        }
    }
}

usertab.addEventListener("click", ()=>{
    switchtab(usertab);
});
searchtab.addEventListener("click", ()=>{
    switchtab(searchtab);
});

function getfromsessionstorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        grantaccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grant container invisible
    grantaccess.classList.remove("active");
    loadingscreen.classList.add("active");

    //API-CALL
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingscreen.classList.remove("active");
    }
}

function renderweatherinfo(weatherinfo){
     //fetch element
     const cityname = document.querySelector("[data-cityname]");
     const countryicon = document.querySelector("[data-countryicon]");
     const desc = document.querySelector("[data-weatherdesc]");
     const weathericon = document.querySelector("[data-weathericon]");
     const temp = document.querySelector("[data-temp]");
     const windspeed = document.querySelector("data-wind");
     const humidity = document.querySelector("data-humidity");
     const clouds = document.querySelector("data-clouds");

     console.log(weatherinfo);

    cityname.innerText = weatherinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherinfo?.weather?.[0]?.description; 
    weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherinfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherinfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherinfo?.wind?.humidity}%`;
    clouds.innerText = `${weatherinfo?.wind?.clouds?.all}%`;
} 



function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{

    }
}


function showposition(position){
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}
const grantaccessbutton = document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click", getLocation);

const searchinput = document.querySelector("[data-searchinput]");

searchform.addEventListener("submit", (e)=>{
    e.preventDefault();
    let cityname = searchinput.value;

    if(cityname === ""){
        return;
    }
    else{
        fetchUserSearchWeatherInfo(cityname);
    }
})

async function fetchUserSearchWeatherInfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccess.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingscreen.classList.remove("active");
    }
}