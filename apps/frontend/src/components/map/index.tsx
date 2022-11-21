import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import highlightedMarkerIcon from '../../assets/icons/highlighted-marker.svg';
import markerIcon from '../../assets/icons/marker.svg';

const defaultMarker = new L.Icon({
  iconUrl: markerIcon,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const highlightedMarker = new L.Icon({
  iconUrl: highlightedMarkerIcon,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

interface ChangeViewProps {
  markers: MarkerType[];
}

interface ChangeViewProps {
  markers: MarkerType[];
}

const ChangeView = ({ markers }: ChangeViewProps) => {
  const map = useMap();
  if (!markers.length) return null;
  const group = L.featureGroup(markers.map((m) => L.marker([m.latitude, m.longitude])));
  map.fitBounds(group.getBounds(), {
    // padding: [20, 10],
  });
  return null;
};

type MarkerType = {
  id: string;
  longitude: number;
  latitude: number;
};

interface MapProps {
  focusedMarkerId?: string;
  markers: MarkerType[];
  mapHeight?: string;
}

const Map = ({ markers, focusedMarkerId, mapHeight = '300px' }: MapProps) => {
  return (
    <MapContainer
      style={{ height: mapHeight }}
      zoom={1}
      center={[0, 0]}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker
          position={[m.latitude, m.longitude]}
          icon={m.id === focusedMarkerId ? highlightedMarker : defaultMarker}
          key={m.id}
          zIndexOffset={m.id === focusedMarkerId ? 10 : 1}
        />
      ))}
      <ChangeView markers={markers} />
    </MapContainer>
  );
};

export default React.memo(Map);
