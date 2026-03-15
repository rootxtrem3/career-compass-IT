import { config } from "../utils/config.js";
import { getCache, setCache } from "./cache.js";

export async function getMarketStats(role, region) {
  const cacheKey = `adzuna:${role}:${region ?? "all"}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const baseUrl = `https://api.adzuna.com/v1/api/jobs/${config.ADZUNA_COUNTRY}/stats`;
  const params = new URLSearchParams({
    app_id: config.ADZUNA_APP_ID,
    app_key: config.ADZUNA_APP_KEY,
    what: role,
    content_type: "application/json"
  });
  if (region) {
    params.set("where", region);
  }

  const response = await fetch(`${baseUrl}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Adzuna stats.");
  }
  const data = await response.json();
  setCache(cacheKey, data);
  return data;
}

export function normalizeMarketData(stats) {
  const salary = {
    minimum: stats.min,
    maximum: stats.max
  };
  const demand = {
    mean: stats.mean,
    histogram: stats.histogram
  };
  return { salary, demand, listings: stats.count };
}
