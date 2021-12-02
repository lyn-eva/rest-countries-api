const filter = document.getElementById("filter");
const options = document.querySelector(".options");

filter.onclick = (e) => {
   options.classList.toggle("options-visible");
};
options.onclick = (e) => {
   if (e.target.tagName == "OPTION") {
      filter.innerText = e.target.innerText;
      options.classList.remove("options-visible");
   }
};

document.addEventListener("DOMContentLoaded", (e) => {
   fetch("https://restcountries.com/v3.1/region/europe", { method: "get" })
      .then((response) => {
         return response.json();
      })
      .then((response) => {
         console.log(response);
         // const {
         //    name: { common }, population,
         //    region,
         //    capital,
         //    flags: { png },
         // } = response[0];
         // createCard(common, population, region, capital, png)
      })
      .catch((error) => {
         console.log(error);
      });
});

function createCard(name, pop, region, capital, flagURL) {
   const mainContent = document.createElement('div');
   mainContent.setAttribute('class', "mainContent");
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
   general.innerHTML = `<p>Population: <span>${pop}</span></p><p>Region: <span>${region}</span></p><p>Capital: <span>${capital}</span></p>`;

   details.append(Name, general);
   card.append(flag, details);
   document.querySelector(".main-content").appendChild(card);
}
