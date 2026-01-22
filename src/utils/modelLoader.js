import localforage from "localforage";

// Initialize localforage instance for 3D models
const modelStore = localforage.createInstance({
  name: "ForzaV2_Models",
  storeName: "models_cache",
});

const urlCache = new Map(); // Memory cache for active Blob URLs

export const getCachedModelUrl = async (url) => {
  if (!url) return null;

  // Check memory cache first
  if (urlCache.has(url)) {
    return urlCache.get(url);
  }

  try {
    // Check IndexedDB
    const cachedBlob = await modelStore.getItem(url);

    if (cachedBlob) {
      console.log(`[Cache] Loading model from IndexedDB: ${url}`);
      window.dispatchEvent(
        new CustomEvent("model-loaded", { detail: { source: "cache", url } }),
      );
      const blobUrl = URL.createObjectURL(cachedBlob);
      urlCache.set(url, blobUrl);
      return blobUrl;
    }

    // Fetch from network
    console.log(`[Network] Fetching model: ${url}`);
    window.dispatchEvent(
      new CustomEvent("model-loading-start", { detail: { url } }),
    );

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch model: ${response.statusText}`);

    const blob = await response.blob();

    // Store in IndexedDB
    await modelStore.setItem(url, blob);
    window.dispatchEvent(
      new CustomEvent("model-loaded", { detail: { source: "network", url } }),
    );

    const blobUrl = URL.createObjectURL(blob);
    urlCache.set(url, blobUrl);
    return blobUrl;
  } catch (error) {
    console.error("Error loading model:", error);
    // Fallback to original URL if caching fails
    return url;
  }
};

// Custom hook to use in components
import { useState, useEffect } from "react";

export const useCachedModelUrl = (url) => {
  const [cachedUrl, setCachedUrl] = useState(null);

  useEffect(() => {
    let active = true;

    if (!url) {
      setCachedUrl(null);
      return;
    }

    const load = async () => {
      try {
        const result = await getCachedModelUrl(url);
        if (active) setCachedUrl(result);
      } catch (e) {
        console.error(e);
        if (active) setCachedUrl(url);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [url]);

  return cachedUrl;
};
