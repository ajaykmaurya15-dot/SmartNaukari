import { useState, useEffect, useCallback } from 'react';
import type { UserLocation } from '@/types';

interface UseLocationReturn {
  location: UserLocation | null;
  permission: 'granted' | 'denied' | 'prompt';
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  clearLocation: () => void;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    const savedPermission = localStorage.getItem('locationPermission');
    
    if (savedLocation && savedPermission === 'granted') {
      setLocation(JSON.parse(savedLocation));
      setPermission('granted');
    }
  }, []);

  // Request location access
  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setPermission('denied');
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000, // 10 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Try to get address details using reverse geocoding
      let locationData: UserLocation = {
        latitude,
        longitude,
      };

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          locationData = {
            ...locationData,
            city: data.city || data.locality,
            state: data.principalSubdivision,
            country: data.countryName,
            postalCode: data.postcode,
          };
        }
      } catch (geoError) {
        console.warn('Reverse geocoding failed:', geoError);
      }

      setLocation(locationData);
      setPermission('granted');
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      localStorage.setItem('locationPermission', 'granted');
    } catch (err) {
      const errorMessage = err instanceof GeolocationPositionError 
        ? getGeolocationErrorMessage(err)
        : 'Failed to get location';
      
      setError(errorMessage);
      setPermission('denied');
      localStorage.setItem('locationPermission', 'denied');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation(null);
    setPermission('prompt');
    localStorage.removeItem('userLocation');
    localStorage.removeItem('locationPermission');
  }, []);

  return {
    location,
    permission,
    isLoading,
    error,
    requestLocation,
    clearLocation,
  };
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access denied. Please enable location permissions in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information unavailable. Please try again later.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while getting location.';
  }
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  if (distance < 10) {
    return `${distance.toFixed(1)}km`;
  }
  return `${Math.round(distance)}km`;
}
