export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  coordinates: string;
  locationName: string;
  lat: number;
  lon: number;
}

export async function fetchWeatherByCoords(lat: number, lon: number, days: number = 1): Promise<WeatherData & { history: any[] }> {
  try {
    // Fetch weather + hourly forecast
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index,precipitation&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&forecast_days=${days}`);
    const weatherData = await weatherResponse.json();

    const history = weatherData.hourly.time.map((time: string, i: number) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      temp: weatherData.hourly.temperature_2m[i],
      humidity: weatherData.hourly.relative_humidity_2m[i],
      windSpeed: weatherData.hourly.wind_speed_10m ? weatherData.hourly.wind_speed_10m[i] : 0,
      pressure: weatherData.current.surface_pressure, // Approximate with current for history if not wanting more API overhead
      rainfall: weatherData.hourly.precipitation[i] || 0
    })).filter((_: any, index: number) => index % (days > 1 ? 12 : 2) === 0);

    return {
      temp: Math.round(weatherData.current.temperature_2m),
      humidity: Math.round(weatherData.current.relative_humidity_2m),
      windSpeed: Math.round(weatherData.current.wind_speed_10m),
      windDirection: Math.round(weatherData.current.wind_direction_10m),
      pressure: Math.round(weatherData.current.surface_pressure),
      visibility: Math.round(weatherData.current.visibility / 1000), // Convert to km
      uvIndex: Math.round(weatherData.current.uv_index),
      precipitation: weatherData.current.precipitation || 0,
      coordinates: `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° W`,
      locationName: `Node [${lat.toFixed(2)}, ${lon.toFixed(2)}]`,
      lat,
      lon,
      history
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}
export async function fetchWeather(city: string, days: number = 1): Promise<WeatherData & { history: any[] }> {
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('Location not found');
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch weather + hourly forecast
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index,precipitation&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&forecast_days=${days}`);
    const weatherData = await weatherResponse.json();

    // Transform hourly data for Recharts
    const history = weatherData.hourly.time.map((time: string, i: number) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      temp: weatherData.hourly.temperature_2m[i],
      humidity: weatherData.hourly.relative_humidity_2m[i],
      windSpeed: weatherData.hourly.wind_speed_10m ? weatherData.hourly.wind_speed_10m[i] : 0,
      pressure: weatherData.current.surface_pressure, // Approximate
      rainfall: weatherData.hourly.precipitation[i] || 0
    })).filter((_: any, index: number) => index % (days > 1 ? 12 : 2) === 0);

    return {
      temp: Math.round(weatherData.current.temperature_2m),
      humidity: Math.round(weatherData.current.relative_humidity_2m),
      windSpeed: Math.round(weatherData.current.wind_speed_10m),
      windDirection: Math.round(weatherData.current.wind_direction_10m),
      pressure: Math.round(weatherData.current.surface_pressure),
      visibility: Math.round(weatherData.current.visibility / 1000), // Convert to km
      uvIndex: Math.round(weatherData.current.uv_index),
      precipitation: weatherData.current.precipitation || 0,
      coordinates: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° W`,
      locationName: `${name}, ${country}`,
      lat: latitude,
      lon: longitude,
      history
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}
