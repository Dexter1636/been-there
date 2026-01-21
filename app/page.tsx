'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_TRIPS } from '@/types/trip';
import { useStartupView } from '@/hooks/useStartupView';

// 动态导入并禁用 SSR
const AMapView = dynamic(() => import('@/components/map/AMapView').then(mod => ({ default: mod.AMapView })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-stone-500 text-sm tracking-wide">正在回忆旅程...</p>
      </div>
    </div>
  )
});

const JourneyPolyline = dynamic(() => import('@/components/map/JourneyPolyline').then(mod => ({ default: mod.JourneyPolyline })), {
  ssr: false
});

const AddTripButton = dynamic(() => import('@/components/ui/AddTripButton').then(mod => ({ default: mod.AddTripButton })), {
  ssr: false
});

const CityLabelLayer = dynamic(() => import('@/components/map/CityLabelLayer').then(mod => ({ default: mod.CityLabelLayer })), {
  ssr: false
});

export default function Home() {
  const [map, setMap] = useState<any>(null);

  // 使用启动视角管理 hook
  const { onPolylineReady } = useStartupView({
    trips: MOCK_TRIPS,
    map: map,
  });

  const handleMapReady = (mapInstance: any) => {
    console.log('Map ready:', mapInstance);
    setMap(mapInstance);
  };

  return (
    <main className="relative" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <AMapView onMapReady={handleMapReady} />
      {map && <CityLabelLayer map={map} />}
      {map && MOCK_TRIPS.map(trip => (
        <JourneyPolyline
          key={trip.id}
          map={map}
          trip={trip}
          onPolylineReady={onPolylineReady}
        />
      ))}
      <AddTripButton />
    </main>
  );
}
