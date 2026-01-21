import { useState, useEffect, useRef } from 'react';

interface UseStartupViewProps {
  trips: any[];
  map: any;
}

export function useStartupView({ trips, map }: UseStartupViewProps) {
  const [polylines, setPolylines] = useState<any[]>([]);
  const hasFittedViewRef = useRef(false);

  const totalTrips = trips.length;
  const allPolylinesLoaded = polylines.length === totalTrips;

  const handlePolylineReady = (polyline: any) => {
    setPolylines(prev => [...prev, polyline]);
  };

  useEffect(() => {
    if (!map || hasFittedViewRef.current) return;

    // Case 1: No tracks - keep macro view (already set by AMapView defaults)
    if (totalTrips === 0) {
      console.log('StartupView: No tracks, showing macro view');
      hasFittedViewRef.current = true;
      return;
    }

    // Case 2: All tracks loaded - fit view once
    if (totalTrips > 0 && allPolylinesLoaded && polylines.length > 0) {
      console.log(`StartupView: Fitting view for ${polylines.length} tracks`);

      setTimeout(() => {
        map.setFitView(polylines, false, [80, 80, 80, 80]);
        hasFittedViewRef.current = true;
      }, 100);
    }
  }, [map, polylines, allPolylinesLoaded, totalTrips]);

  return {
    onPolylineReady: handlePolylineReady,
  };
}
