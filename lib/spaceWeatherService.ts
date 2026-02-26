type SpaceWeatherSnapshot = {
  protonFlux: number; // simplified numeric signal
  source: "live" | "fallback";
  updatedAt: string;
};

// In-memory cache so we don't call API every second
let cache: SpaceWeatherSnapshot | null = null;
let lastFetch = 0;

export async function fetchSpaceWeather(): Promise<SpaceWeatherSnapshot> {
  const now = Date.now();

  // cache for 5 minutes
  if (cache && now - lastFetch < 5 * 60 * 1000) {
    return cache;
  }

  try {
    // NOAA SWPC JSON endpoint (public)
    // If this fails, fallback is used.
    const res = await fetch(
      "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json",
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error(`SWPC fetch failed: ${res.status}`);

    const data = await res.json();

    // Pick a recent proton flux value if available (schema can vary)
    // We safely search for a numeric "flux" field.
    let flux = 1;

    if (Array.isArray(data)) {
      for (let i = data.length - 1; i >= 0; i--) {
        const row = data[i];
        const maybe =
          Number(row?.flux) ||
          Number(row?.["flux_gt_10mev"]) ||
          Number(row?.["proton_flux"]) ||
          Number(row?.value);

        if (Number.isFinite(maybe) && maybe > 0) {
          flux = maybe;
          break;
        }
      }
    }

    cache = {
      protonFlux: flux,
      source: "live",
      updatedAt: new Date().toISOString(),
    };
    lastFetch = now;
    return cache;
  } catch {
    // fallback if API blocked/rate-limited/unavailable
    cache = {
      protonFlux: 1.5,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    };
    lastFetch = now;
    return cache;
  }
}