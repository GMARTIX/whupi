"use client";

import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useCallback, useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '24px'
};

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialCenter: { lat: number, lng: number };
}

export default function MapPicker({ onLocationSelect, initialCenter }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });

  const [markerPos, setMarkerPos] = useState(initialCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPos(newPos);
      
      // Reverse Geocoding to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: newPos }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          onLocationSelect(newPos.lat, newPos.lng, results[0].formatted_address);
        }
      });
    }
  };

  if (!isLoaded) return <div className="h-[300px] flex items-center justify-center bg-zinc-900/50 rounded-3xl border border-white/5"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={initialCenter}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [
              {
                "elementType": "geometry",
                "stylers": [{"color": "#242f3e"}]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [{"color": "#242f3e"}]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#746855"}]
              },
              // more dark mode styles could be added here
            ]
          }}
        >
          <Marker 
            position={markerPos} 
            draggable={true} 
            onDragEnd={handleMarkerDragEnd}
            icon={{
               path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
               fillColor: "#3b82f6",
               fillOpacity: 1,
               strokeWeight: 2,
               strokeColor: "#ffffff",
               scale: 2,
               anchor: new google.maps.Point(12, 22)
            }}
          />
        </GoogleMap>
      </div>
      <div className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5">
         <MapPin className="w-4 h-4 text-primary shrink-0" />
         <span className="text-zinc-500 text-xs">Mueve el globo azul para ubicar tu domicilio exacto</span>
      </div>
    </div>
  );
}
