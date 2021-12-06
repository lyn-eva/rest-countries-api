const filter = document.getElementById("filter");
const options = document.querySelector(".options");
const loader = document.querySelector('.loader');
const mode = document.getElementById('mode');
const input = document.getElementById('input');
const main = document.querySelector(".main-hdr");
const more = document.querySelector('.more-details');

let history = []; //stack data structure is perfect fit to record the clicked countries :)

document.addEventListener("DOMContentLoaded", () => {
   'use strict';
   let data, codes;   
   fetch("https://restcountries.com/v3.1/all", { method: "get" })
   .then((response) => {
      return response.json();
   })
   .then((response) => {
      data = response;
      codes = response.reduce((obj, cd, i) => ({...obj, [cd.cca3] : [cd.name.common, i]}), {});
      const mainContent = generateCards(response, codes);
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
      if (e.target.className == "option") {
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
   more.firstElementChild.onclick = () => { //back key
      if (history.length) { // recorded history
         addInnerHtml(data, history.pop(), codes);
      }  
      else {
         main.nextElementSibling.style.display = "flex";
         main.style.display = "flex";
         more.style.display = "none";
         more.lastElementChild.remove();
      } 
   }
});
   
function generateCards(cards, codes) {
   const mainContent = document.createElement('div');
   mainContent.setAttribute('class', "main-content");
   cards.forEach((cd, i) => {
      const temp = createCard(cd);   
      temp.setAttribute('data-id', i); //
      mainContent.appendChild(temp);
      
      temp.addEventListener('click', () => {
         if (more.firstElementChild.nextElementSibling) return
         main.nextElementSibling.style.display = "none";
         main.style.display = "none";
         more.style.display = "block";
         more.firstElementChild.after(moreDetailsPage(cards, i, codes));
         addInnerHtml(cards, i, codes);       
      });
   });
   return mainContent;
}

function createCard(cd) {
   const {name: { common }, population,region, capital, flags: { png },} = cd;
   const card = document.createElement('div')
   card.setAttribute('class', "card");
   const flag = document.createElement('div');
   flag.setAttribute('class', "flag");
   const details = document.createElement('div');
   details.setAttribute('class', "details");
   const general = document.createElement('div');
   general.setAttribute('class', "general-details");
   const Name = document.createElement('h1');
   Name.innerHTML = common;
   
   flag.innerHTML = `<img src=${png} alt=${common}>`;
   general.innerHTML = `<p>Population: <span>${population.toLocaleString()}</span></p><p>Region: <span>${region}</span></p><p>Capital: <span>${capital ? capital : "unknown"}</span></p>`;

   details.append(Name, general);
   card.append(flag, details);
   return card;
}

function filterByRegion(cards, filterName) {
   const childs = document.querySelectorAll('.card');
   neutralize(childs);
   cards.forEach( (card, i) => {
      const {region} = card;
      if (region == filterName) return
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
   cards.forEach(card => card.style.display = "block");
}

function moreDetailsPage(cards, i, codes) {
   const DetailsCtr = document.createElement('div');
   DetailsCtr.setAttribute("class", 'details-ctr flex');
   const flag = document.createElement('div');
   flag.setAttribute("class", 'flag');
   const h2 = document.createElement('h2');
   // h2.setAttribute("id", 'country-name');
   const country = document.createElement('div');
   country.setAttribute("class", 'country');
   country.setAttribute("data-id", i);
   const countryDetails = document.createElement('div');
   countryDetails.setAttribute("class", 'country-details flex');
   const col1 = document.createElement('div');
   col1.setAttribute("class", 'col-1');
   const col2 = document.createElement('div');
   col2.setAttribute("class", 'col-2');
   const border = document.createElement('div');
   border.setAttribute("class", 'borders');
   
   countryDetails.append(col1, col2);
   country.append(h2, countryDetails, border);
   DetailsCtr.append(flag, country);

   border.onclick =  e => {
      if (e.target.tagName !== "BUTTON") return
      const cc = e.currentTarget.parentElement.dataset.id;
      history.push(cc);
      addInnerHtml(cards, e.target.dataset.id, codes);
   };
   return DetailsCtr;
}

function addInnerHtml(cards, i, codes) {
   document.querySelector(".country").setAttribute("data-id", i);//

   const {name : {common, nativeName}, borders, flags: {svg}, population, region, subregion, capital, tld, currencies, languages} = cards[i];
   document.querySelector(".country h2").innerHTML = common;
   document.querySelector(".details-ctr .flag").innerHTML = `<img src=${svg} alt=${common}>`;
   document.querySelector(".col-1").innerHTML = `<p>Native Name: <span>${nativeName[Object.keys(nativeName)[0]].official}</span></p><p>Population: <span>${population.toLocaleString()}</span></p><p>Region: <span>${region}</span></p><p>Sub Region: <span>${subregion}</span></p><p>Capital: <span>${capital ? capital : "unknown"}</span></p>`;
   document.querySelector(".col-2").innerHTML = `<p>Top Level Domain: <span>${tld.join(", ")}</span></p><p>Currencies: <span>${Object.values(currencies).map(cc => cc.name).join(", ")}</span></p><p>Languages: <span>${Object.values(languages).join(", ")}</span></p>`;  
   const border = document.querySelector(".borders");

   // LOGIC: it's not necessary to remove innerHTML if no border countries, as you won't need to call this function again for countries who don't have border countries in the first place 
   if (borders) { 
      border.innerHTML = "<span>Border Countries: </span>";
      borders.slice(0, 3).forEach( br => {
         border.insertAdjacentHTML("Beforeend", `<button type="button" data-id=${codes[br][1]}>${codes[br][0]}</button>`);
      });
   }
}