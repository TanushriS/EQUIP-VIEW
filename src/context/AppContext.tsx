import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, DatasetSummary, Equipment } from '@/types/equipment';
import { getTranslation } from '@/lib/translations';
import { api } from '@/utils/api';

interface LocationInfo {
  country: string;
  city: string;
  timezone: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  location: LocationInfo | null;
  datasets: DatasetSummary[];
  currentData: Equipment[];
  addDataset: (datasetResponse: any) => void;
  setCurrentData: (data: Equipment[]) => void;
  deleteDataset: (id: string) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MAX_DATASETS = 5;

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [location, setLocation] = useState<LocationInfo | null>(null);



  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [currentData, setCurrentData] = useState<Equipment[]>([]);

  // Detect location on mount
  useEffect(() => {
    detectLocation();
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const history = await api.getHistory();
      // Handle DRF pagination if present (results array), otherwise array
      const results = Array.isArray(history) ? history : history.results || [];

      const mapped = results.map(mapBackendToSummary);
      setDatasets(mapped);

      // If we have history but no current data, load the latest
      if (mapped.length > 0 && currentData.length === 0) {
        setCurrentData(mapped[0].data);
      }
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const mapBackendToSummary = (d: any): DatasetSummary => ({
    id: d.id,
    uploadedAt: new Date(d.uploaded_at),
    fileName: d.filename,
    totalCount: d.stats?.totalEquipment || d.data?.length || 0,
    avgFlowrate: d.stats?.avgFlowrate || 0,
    avgPressure: d.stats?.avgPressure || 0,
    avgTemperature: d.stats?.avgTemperature || 0,
    typeDistribution: d.stats?.typeDistribution || {},
    data: d.data || []
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Datasets are now managed by backend, no local storage sync needed (or we can keep it as cache, but API source of truth is better)

  const detectLocation = async () => {
    // Helper to fetch IP location as fallback
    const fetchIpLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_name || 'Unknown';

        // Auto-detect language base on IP country
        const countryToLang: Record<string, Language> = {
          'Spain': 'es',
          'Mexico': 'es',
          'France': 'fr',
          'Germany': 'de',
          'China': 'zh',
          'Japan': 'ja',
          'India': 'hi',
        };

        if (countryToLang[country] && !localStorage.getItem('language')) {
          setLanguageState(countryToLang[country]);
        }

        return {
          country: country,
          city: data.city || 'Unknown',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
      } catch (e) {
        console.error('IP location fallback failed', e);
        return null;
      }
    };

    // Try Browser Geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            // Extract address components
            const address = data.address || {};
            const city = address.city || address.town || address.village || address.suburb || 'Unknown';
            const country = address.country || 'Unknown';

            setLocation({
              city,
              country,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });

            // Also try to set language from Geocoded country if needed
            const countryToLang: Record<string, Language> = {
              'Spain': 'es',
              'Mexico': 'es',
              'France': 'fr',
              'Germany': 'de',
              'China': 'zh',
              'Japan': 'ja',
              'India': 'hi',
            };
            if (countryToLang[country] && !localStorage.getItem('language')) {
              setLanguageState(countryToLang[country]);
            }

          } catch (error) {
            console.error('Reverse geocoding failed', error);
            // Fallback to IP
            const ipLoc = await fetchIpLocation();
            if (ipLoc) setLocation(ipLoc);
          }
        },
        async (error) => {
          console.warn('Geolocation permission denied or timed out', error);
          // Fallback to IP
          const ipLoc = await fetchIpLocation();
          if (ipLoc) setLocation(ipLoc);
        },
        { timeout: 10000 }
      );
    } else {
      // No geolocation support, use IP
      const ipLoc = await fetchIpLocation();
      if (ipLoc) setLocation(ipLoc);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const addDataset = (newDatasetResponse: any) => {
    const summary = mapBackendToSummary(newDatasetResponse);
    setDatasets((prev) => [summary, ...prev].slice(0, MAX_DATASETS));
    setCurrentData(summary.data);
  };

  const deleteDataset = (id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
  };

  const t = (key: string) => getTranslation(key, language);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        location,
        datasets,
        currentData,
        addDataset,
        setCurrentData,
        deleteDataset,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
