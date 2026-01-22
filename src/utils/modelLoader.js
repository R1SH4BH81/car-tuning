import localforage from "localforage";

// Initialize localforage instance for 3D models
const modelStore = localforage.createInstance({
  name: "ForzaV2_Models",
  storeName: "models_cache",
});

const urlCache = new Map(); // Memory cache for active Blob URLs

export const peekCachedModelUrl = (url) => {
  if (!url) return null;
  return urlCache.get(url) ?? null;
};

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
import { useGLTF } from "@react-three/drei";

export const preloadModel = async (url) => {
  const cachedUrl = await getCachedModelUrl(url);
  if (cachedUrl) useGLTF.preload(cachedUrl);
  return cachedUrl;
};

export const useCachedModelUrl = (url) => {
  const memoryCachedUrl = peekCachedModelUrl(url);
  const [cacheState, setCacheState] = useState(() => ({
    sourceUrl: url ?? null,
    cachedUrl: memoryCachedUrl,
  }));

  useEffect(() => {
    let active = true;

    if (!url) return;

    const load = async () => {
      try {
        const result = await getCachedModelUrl(url);
        if (active) setCacheState({ sourceUrl: url, cachedUrl: result });
      } catch (e) {
        console.error(e);
        if (active) setCacheState({ sourceUrl: url, cachedUrl: url });
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [url]);

  if (!url) return null;
  if (cacheState.sourceUrl !== url) return memoryCachedUrl;
  return cacheState.cachedUrl ?? memoryCachedUrl;
};
