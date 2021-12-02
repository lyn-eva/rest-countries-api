const filter = document.getElementById('filter');
const options = document.querySelector('.options');

filter.onclick = e => {
   options.classList.toggle('options-visible');
}
options.onclick = e => {
   if (e.target.tagName == "OPTION") {
      filter.innerText = e.target.innerText;
      options.classList.remove('options-visible');
   }
}

fetch("https://restcountries.com/v3.1/name/germany", {method:"get"})
.then( response => {
   return response.json()
})
.then( response => {
   console.log(response[0].coatOfArms.png);
})
.catch( error => {
   console.log(error);
})