import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;
const searchCountry = document.querySelector("#search-box");
searchCountry.addEventListener("input", debounce(() => { 
    fetchCountries(searchCountry.value)
        .then((resp) => {
            return resp.json();
        }).then((countries) => {
            console.log(countries);
            const countryInfo = document.querySelector(".country-info");
            const ul = document.querySelector(".country-list");
            ul.style.listStyle = "none";
            const fragment = document.createDocumentFragment();
            if (countries.length > 10) {
                ul.innerHTML = "";
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            }
            if (countries.length >= 2 && countries.length <= 10) {
                for (const country of countries) {
                    const li = document.createElement("li");
                    const img = document.createElement("img");
                    const span = document.createElement("span");
                    span.append(country.name.common);
                    img.setAttribute("src", country.flags.svg);
                    img.style.width = "25px";
                    img.style.height = "20px";
                    li.append(img, span);
                    fragment.append(li);
                }
                ul.innerHTML = "";
                countryInfo.innerHTML = "";
                ul.append(fragment);
            }
            if (countries.length == 1) {
                const countryInfoFragment = document.createDocumentFragment();
                for (const country of countries) {
                    const countriesKey = Object.keys(country);
                    const li = document.createElement("li");
                    const img = document.createElement("img");
                    const b = document.createElement("b");
                    b.append(`${country.name.common}`);
                    img.setAttribute("src", country.flags.svg);
                    img.style.width = "25px";
                    img.style.height = "20px";
                    li.append(img, b);
                    fragment.append(li);
                    const capitalP = document.createElement("p");
                    console.log(countries[0].languages);
                    const jezyki = Object.values(country.languages).join(', ');
                    capitalP.insertAdjacentHTML("beforeend", `<b>${countriesKey[2]}: </b>${country.capital}`);
                    countryInfoFragment.append(capitalP);
                    const languagesP = document.createElement("p");
                    languagesP.insertAdjacentHTML("beforeend", `<b>${countriesKey[3]}: </b>${jezyki}`);
                    countryInfoFragment.append(languagesP);
                    const populationP = document.createElement("p");
                    populationP.insertAdjacentHTML("beforeend", `<b>${countriesKey[4]}: </b>${country.population}`);
                    countryInfoFragment.append(populationP);
                }
                ul.innerHTML = "";
                countryInfo.innerHTML = "";
                ul.append(fragment);
                countryInfo.append(countryInfoFragment);
            }
        })
        .catch(() => { 
            Notiflix.Notify.failure("Oops, there is no country with that name");
        });
}, DEBOUNCE_DELAY));