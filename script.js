const filter = document.getElementById("filter");
const options = document.querySelector(".options");
const loader = document.querySelector('.loader');
const mode = document.getElementById('mode');

document.addEventListener("DOMContentLoaded", () => {
   let data;   
   fetch("https://restcountries.com/v3.1/all", { method: "get" })
   .then((response) => {
      // console.log(response);
      return response.json();
   })
   .then((response) => {
      data = response;
      const mainContent = generateCards(response);
      loader.style.display = "none";
      document.querySelector(".main-hdr").after(mainContent);
   })
   .catch((error) => {
      console.log(error);  
      document.querySelector('.loader').after("Please Check Your Internet Connection");
   });
   
   filter.onclick = (e) => {
      options.classList.toggle("options-visible");
   };
   //filter by region
   options.onclick = (e) => {
      if (e.target.tagName == "OPTION") {
         filter.innerText = e.target.innerText;
         options.classList.remove("options-visible");
   
         filterByRegion(data, e.target.innerText);
      }
   };
   let darkMode = true;
   mode.onclick = () => {
      const root = document.querySelector(":root");
      if (darkMode) {
         root.style.setProperty("--clr-d-mode-background", "hsl(0, 0%, 98%)");
         root.style.setProperty("--clr-elements", "hsl(0, 0%, 100%)");
         root.style.setProperty("--d-mode-text--l-mode-element", "hsl(200, 15%, 8%)");
         root.style.setProperty("--clr-detail-text", "rgba(0, 0, 0, 0.7)");
         darkMode = false;
      }
      else {
         root.style.setProperty("--clr-d-mode-background", "hsl(207, 26%, 17%)");
         root.style.setProperty("--clr-elements", "hsl(209, 23%, 22%)");
         root.style.setProperty("--d-mode-text--l-mode-element", "hsl(0, 0%, 100%)");
         root.style.setProperty("--clr-detail-text", "rgba(255, 255, 255, 0.7)");
         darkMode = true;
      }
   };
});
   
function generateCards(cards) {
   const mainContent = document.createElement('div');
   mainContent.setAttribute('class', "main-content");

   cards.forEach(cd => {
      const {name: { common }, population,region, capital, flags: { png },} = cd;
      const temp = createCard(common, population, region, capital, png);   
      mainContent.appendChild(temp);
   });

   return mainContent;
}

function createCard(name, pop, region, capital, flagURL) {
   const card = document.createElement('div')
   card.setAttribute('class', "card");
   const flag = document.createElement('div');
   flag.setAttribute('class', "flag");
   const details = document.createElement('div');
   details.setAttribute('class', "details");
   const general = document.createElement('div');
   general.setAttribute('class', "general-details");
   const Name = document.createElement('h1');
   Name.innerHTML = name;

   flag.innerHTML = `<img src=${flagURL} alt=${name}>`;
   general.innerHTML = `<p>Population: <span>${pop.toLocaleString()}</span></p><p>Region: <span>${region}</span></p><p>Capital: <span>${capital ? capital : "unknown"}</span></p>`;

   details.append(Name, general);
   card.append(flag, details);
   return card;
}

function filterByRegion(cards, filterName) {
   const childs = document.querySelectorAll('.card');
   childs.forEach(child => {
      child.style.display = "block";
   })
   cards.forEach( (card, i) => {
      const {region} = card;
      if (region !== filterName)
         childs[i].style.display = "none";
   })
}
