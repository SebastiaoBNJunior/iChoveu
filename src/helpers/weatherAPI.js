export const TOKEN = import.meta.env.VITE_TOKEN; // Importando a informação TOKEN do arquivo .env

export const searchCities = async (term) => {
  const API_CITIES = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`; // API para buscar a cidade

  try {
    const city = await fetch(API_CITIES); // Realiza uma requisição assíncrona para a API de busca de cidades
    const data = await city.json(); // Converte a resposta em formato JSON

    if (data.length === 0) {
      window.alert('Nenhuma cidade encontrada!'); // Exibe um alerta se nenhum resultado for retornado
    }

    return data; // Retorna os dados obtidos da API
  } catch (error) {
    return error; // Retorna qualquer erro ocorrido durante a requisição
  }
};

export const getWeatherByCity = async (cityURL) => {
  const API_CITY = `http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${cityURL}`; // API para buscar informações do clima da cidade
  const city = await fetch(API_CITY); // Realiza uma requisição assíncrona para a API de clima
  const data = await city.json(); // Converte a resposta em formato JSON

  return data; // Retorna os dados obtidos da API
};
