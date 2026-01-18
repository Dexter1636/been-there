'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_TRIP } from '@/types/trip';

// 动态导入并禁用 SSR
const AMapView = dynamic(() => import('@/components/map/AMapView').then(mod => ({ default: mod.AMapView })), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center">加载地图中...</div>
});

const JourneyPolyline = dynamic(() => import('@/components/map/JourneyPolyline').then(mod => ({ default: mod.JourneyPolyline })), {
  ssr: false
});

const AddTripButton = dynamic(() => import('@/components/ui/AddTripButton').then(mod => ({ default: mod.AddTripButton })), {
  ssr: false
});

export default function Home() {
  const [map, setMap] = useState<any>(null);

  return (
    <main className="relative w-full h-screen">
      <AMapView onMapReady={setMap} />
      {map && <JourneyPolyline map={map} trip={MOCK_TRIP} />}
      <AddTripButton />
    </main>
  );
}
