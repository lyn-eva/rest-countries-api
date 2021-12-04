const filter = document.getElementById("filter");
const options = document.querySelector(".options");
const loader = document.querySelector('.loader');
const mode = document.getElementById('mode');
const input = document.getElementById('input');
const main = document.querySelector(".main-hdr");

document.addEventListener("DOMContentLoaded", () => {
   let data;   
   fetch("https://restcountries.com/v3.1/all", { method: "get" })
   .then((response) => {
      // console.log(response.json());
      return response.json();
   })
   .then((response) => {
      console.log(response);
      data = response;
      const mainContent = generateCards(response);
      loader.style.display = "none";
      main.after(mainContent);
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
   //search with keyword
   input.oninput = () => {
      input.value ? searchWithKeyword(data, input.value) : neutralize(document.querySelectorAll('.card'));
   };
   //darkmode
   let darkMode = true;
   mode.onclick = () => {
      if (darkMode) {
         switchTheme("hsl(0, 0%, 98%)", "hsl(0, 0%, 100%)", "hsl(200, 15%, 8%)", "rgba(0, 0, 0, 0.7)");
         darkMode = false;
      }
      else {
         switchTheme("hsl(207, 26%, 17%)", "hsl(209, 23%, 22%)", "hsl(0, 0%, 100%)", "rgba(255, 255, 255, 0.7)");
         darkMode = true;
      }
   };
});
   
function generateCards(cards) {
   const more = document.querySelector('.more-details');
   const mainContent = document.createElement('div');
   mainContent.setAttribute('class', "main-content");

   cards.forEach((cd, i) => {
      const {name: { common }, population,region, capital, flags: { png },} = cd;
      const temp = createCard(common, population, region, capital, png);   
      temp.setAttribute('id', i);
      mainContent.appendChild(temp);

      temp.addEventListener('click', () => {
         if (!more.firstElementChild.nextElementSibling) {
            main.nextElementSibling.style.display = "none";
            more.style.display = "block";
            more.firstElementChild.after(moreDetailsPage(cards, i));
         }
      });
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
   neutralize(childs);
   cards.forEach( (card, i) => {
      const {region} = card;
      if (region !== filterName)
         childs[i].style.display = "none";
   })
}

function searchWithKeyword(cards, searchKeyword) {
   const childs = document.querySelectorAll('.card');
   neutralize(childs);
   cards.forEach( (card, i) => {
      const {name: {common}} = card;
      if (!common.toLowerCase().includes(searchKeyword))
         childs[i].style.display = "none";
   })
}

function switchTheme(clr1, clr2, clr3, clr4) {
   const root = document.querySelector(":root");
   root.style.setProperty("--clr-background", clr1);
   root.style.setProperty("--clr-elements", clr2);
   root.style.setProperty("--clr-elements-and-text", clr3);
   root.style.setProperty("--clr-detail-text", clr4);
}

function neutralize(cards) {
   cards.forEach(card => {
      card.style.display = "block";
   })
}

function moreDetailsPage(cards, id) {
   const DetailsCtr = document.createElement('div');
   DetailsCtr.setAttribute("class", 'details-ctr flex');
   const flag = document.createElement('div');
   flag.setAttribute("class", 'flag');
   const h2 = document.createElement('h2');
   h2.setAttribute("id", 'country-name');
   const country = document.createElement('div');
   country.setAttribute("class", 'country');
   const countryDetails = document.createElement('div');
   countryDetails.setAttribute("class", 'country-details flex');
   const col1 = document.createElement('div');
   col1.setAttribute("class", 'col-1');
   const col2 = document.createElement('div');
   col2.setAttribute("class", 'col-2');
   const borders = document.createElement('div');
   borders.setAttribute("class", 'borders');

   const {name : {common, nativeName}, flags: {svg}, population, region, subregion, capital, tld, currencies, languages} = cards[id];
   h2.innerHTML = common;
   flag.innerHTML = `<img src=${svg} alt=${common}>`;
   col1.innerHTML = `<p>Native Name: <span>${nativeName[Object.keys(nativeName)[0]].official}</span></p><p>Population: <span>${population}</span></p><p>Region: <span>${region}</span></p><p>Sub Region: <span>${subregion}</span></p><p>Capital: <span>${capital ? capital : "unknown"}</span></p>`;
   col2.innerHTML = `<p>Top Level Domain: <span>${tld.join(", ")}</span></p><p>Currencies: <span>${currencies[Object.keys(currencies)].name}</span></p><p>Languages: <span>${Object.values(languages).join(", ")}</span></p>`;
   borders.innerHTML = `<span>Border Countries: </span><button type="button"></button><button type="button"></button><button type="button"></button>`;

   countryDetails.append(col1, col2);
   country.append(h2, countryDetails, borders);
   DetailsCtr.append(flag, country);

   return DetailsCtr;
}
{/* <div class="details-ctr flex">
<div class="flag"></div>
<div class="country">
   <h2>Belgium</h2>
   <div class="country-details flex">
      <div class="col-1">
         <p>Native Name: <span>Belgie</span></p>
         <p>Population: <span>Belgie</span></p>
         <p>Region: <span>Belgie</span></p>
         <p>Sub Region: <span>Belgie</span></p>
         <p>Capital: <span>Belgie</span></p>
      </div>
      <div class="col-2">
         <p>Top Level Domain: <span>Belgie</span></p>
         <p>Currencies: <span>Belgie</span></p>
         <p>Languages: <span>Dutch, French, German</span></p>
      </div>
   </div>
   <div class="borders">
      <span>Border Countries: </span>
      <button type="button">France</button>
      <button type="button">Germany</button>
      <button type="button">Netherlands</button>
   </div>
</div>
</div> */}