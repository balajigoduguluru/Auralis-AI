import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWeather, fetchWeatherByCoords } from '../../services/weatherService';

const mockGeoResponse = {
  results: [{ latitude: 48.8566, longitude: 2.3522, name: 'Paris', country: 'France' }],
};

const mockForecastResponse = {
  current: {
    temperature_2m: 22,
    relative_humidity_2m: 55,
    wind_speed_10m: 15,
    wind_direction_10m: 180,
    surface_pressure: 1013,
    visibility: 10000,
    uv_index: 5,
    precipitation: 0,
  },
  hourly: {
    time: ['2025-07-17T00:00', '2025-07-17T12:00'],
    temperature_2m: [18, 22],
    relative_humidity_2m: [70, 55],
    wind_speed_10m: [10, 15],
    precipitation: [0.1, 0],
  },
};

describe('fetchWeather', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches weather data by city name', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockGeoResponse) } as Response)
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockForecastResponse) } as Response);

    const result = await fetchWeather('Paris');

    expect(result.temp).toBe(22);
    expect(result.humidity).toBe(55);
    expect(result.locationName).toBe('Paris, France');
    expect(result.lat).toBe(48.8566);
    expect(result.lon).toBe(2.3522);
    expect(result.history.length).toBeGreaterThanOrEqual(1);
  });

  it('calls geocoding API with correct URL', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockGeoResponse) } as Response)
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockForecastResponse) } as Response);

    await fetchWeather('London');

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('geocoding-api.open-meteo.com/v1/search?name=London')
    );
  });

  it('throws when location is not found', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve({ results: [] }) } as Response);

    await expect(fetchWeather('Nowhere')).rejects.toThrow('Location not found');
  });

  it('throws on network error', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchWeather('Paris')).rejects.toThrow();
  });
});

describe('fetchWeatherByCoords', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches weather data by coordinates', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockForecastResponse) } as Response);

    const result = await fetchWeatherByCoords(48.8566, 2.3522);

    expect(result.temp).toBe(22);
    expect(result.coordinates).toContain('48.8566');
    expect(result.history.length).toBeGreaterThanOrEqual(1);
  });

  it('throws on network error', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchWeatherByCoords(48.8566, 2.3522)).rejects.toThrow();
  });
});
