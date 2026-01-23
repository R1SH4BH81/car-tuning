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

import { useGLTF } from "@react-three/drei";

// Suspense Resource Cache
const resourceCache = new Map();

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    },
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

export const preloadModel = async (url) => {
  if (!resourceCache.has(url)) {
    const promise = getCachedModelUrl(url);
    resourceCache.set(url, wrapPromise(promise));
  }
  const cachedUrl = await getCachedModelUrl(url); // Wait for it
  if (cachedUrl) useGLTF.preload(cachedUrl);
  return cachedUrl;
};

export const useCachedModelUrl = (url) => {
  if (!url) return null;

  let resource = resourceCache.get(url);
  if (!resource) {
    const promise = getCachedModelUrl(url);
    resource = wrapPromise(promise);
    resourceCache.set(url, resource);
  }

  return resource.read();
};
