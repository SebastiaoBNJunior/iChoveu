import { searchCities, getWeatherByCity, TOKEN } from './weatherAPI';

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });
  console.log(forecastList);
  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon, url } = cityInfo; // Destruturação do objeto cityInfo para obter as propriedades individuais
  const cityElement = createElement('li', 'city'); // Cria um elemento 'li' com a classe 'city' e o armazena em cityElement

  const button = createElement('button', 'button'); // Cria um elemento 'button' e o armazena em button
  button.innerText = 'Ver previsão'; // Define o texto interno do botão como 'Ver previsão'

  const headingElement = createElement('div', 'city-heading'); // Cria um elemento 'div' com a classe 'city-heading' e o armazena em headingElement

  const nameElement = createElement('h2', 'city-name', name); // Cria um elemento 'h2' com a classe 'city-name', define o texto interno como o nome da cidade e o armazena em nameElement
  const countryElement = createElement('p', 'city-country', country); // Cria um elemento 'p' com a classe 'city-country', define o texto interno como o país da cidade e o armazena em countryElement

  headingElement.append(nameElement, countryElement); // Adiciona nameElement e countryElement como filhos de headingElement

  const tempElement = createElement('p', 'city-temp', `${temp}º`); // Cria um elemento 'p' com a classe 'city-temp', define o texto interno como a temperatura da cidade e o armazena em tempElement
  const conditionElement = createElement('p', 'city-condition', condition); // Cria um elemento 'p' com a classe 'city-condition', define o texto interno como a condição climática da cidade e o armazena em conditionElement

  const tempContainer = createElement('div', 'city-temp-container'); // Cria um elemento 'div' com a classe 'city-temp-container' e o armazena em tempContainer
  tempContainer.append(conditionElement, tempElement); // Adiciona conditionElement e tempElement como filhos de tempContainer

  const iconElement = createElement('img', 'condition-icon'); // Cria um elemento 'img' com a classe 'condition-icon' e o armazena em iconElement
  iconElement.src = icon.replace('64x64', '128x128'); // Define a propriedade 'src' do elemento 'img' como o valor do ícone com tamanho substituído

  const infoContainer = createElement('div', 'city-info-container'); // Cria um elemento 'div' com a classe 'city-info-container' e o armazena em infoContainer
  infoContainer.append(tempContainer, iconElement); // Adiciona tempContainer e iconElement como filhos de infoContainer

  const urlContainer = createElement('div', 'url-container'); // Cria um elemento 'div' com a classe 'url-container' e o armazena em urlContainer
  const urlEl = createElement('p', 'city-url', url); // Cria um elemento 'p' com a classe 'city-url', define o texto interno como a URL da cidade e o armazena em urlEl
  urlContainer.appendChild(urlEl); // Adiciona urlEl como filho de urlContainer

  cityElement.append(headingElement, infoContainer, button); // Adiciona headingElement, infoContainer e button como filhos de cityElement

  button.addEventListener('click', async () => {
    const API_CITIES = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${cityInfo.url}&days=7`; // URL da API para obter a previsão do tempo
    const cities = await fetch(API_CITIES); // Realiza uma chamada assíncrona para obter a previsão do tempo
    const data = await cities.json(); // Converte a resposta em formato JSON
    const forecast = data.forecast.forecastday; // Obtém os dados da previsão do tempo para os próximos dias
    const forecastResult = forecast.map((day) => ({
      date: day.date,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: day.day.condition.text,
      icon: day.day.condition.icon,
    })); // Mapeia os dados da previsão do tempo para um formato desejado
    showForecast(forecastResult); // Exibe a previsão do tempo na interface do usuário
  });

  return cityElement; // Retorna o elemento HTML representando a cidade
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export async function handleSearch(event) {
  event.preventDefault(); // Previne o comportamento padrão do evento de envio do formulário, evitando o recarregamento da página

  const cities = document.querySelector('#cities'); // Seleciona o elemento com o ID 'cities' e o armazena em uma constante 'cities'
  const searchValue = document.getElementById('search-input').value; // Obtém o valor digitado no campo de busca e o armazena em uma constante 'searchValue'

  // Chamada assíncrona para obter as cidades com base no valor de busca
  const everyCities = (await searchCities(searchValue))
    .map((city) => getWeatherByCity(city.url));

  // Executa todas as chamadas assíncronas de obtenção do clima das cidades em paralelo usando Promise.all
  Promise.all(everyCities).then((everycities) => {
    everycities.forEach((city, index) => {
      const result = {
        name: city.location.name,
        country: city.location.country,
        temp: city.current.temp_c,
        condition: city.current.condition.text,
        icon: city.current.condition.icon,
        url: getCities[index].url,
      };

      cities.appendChild(createCityElement(result)); // Cria um elemento HTML representando a cidade e o adiciona à lista de cidades
    });
  });
}
