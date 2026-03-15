import NodeCache from "node-cache";
import { config } from "../utils/config.js";

const cache = new NodeCache({ stdTTL: config.CACHE_TTL_SECONDS });

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, value) {
  cache.set(key, value);
}
