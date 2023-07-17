const TOKEN = import.meta.env.VITE_TOKEN; // Importando o token do arquivo .env

export const searchCities = async (term) => {
  try {
    const resolve = await fetch(`http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`);
    const cities = await resolve.json();
    if (cities.length === 0) {
      throw new Error();
    }
  } catch (error) {
    alert('Nenhuma cidade encontrada');
  }
};

export const getWeatherByCity = (/* cityURL */) => {
//   seu código aqui
};
