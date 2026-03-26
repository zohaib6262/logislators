import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

if (L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
}
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

/** GeoJSON Point coordinates are [lng, lat]. */
export function getSchoolLatLng(school) {
  const loc = school?.location;
  if (!loc || loc.type !== "Point" || !Array.isArray(loc.coordinates) || loc.coordinates.length < 2) {
    return null;
  }
  const [lng, lat] = loc.coordinates;
  const la = Number(lat);
  const ln = Number(lng);
  if (Number.isNaN(la) || Number.isNaN(ln)) return null;
  if (la < -90 || la > 90 || ln < -180 || ln > 180) return null;
  return { lat: la, lng: ln };
}

function formatAddressLine(school) {
  const addr = school?.address;
  if (addr != null && typeof addr === "object" && !Array.isArray(addr)) {
    if (typeof addr.fullAddress === "string" && addr.fullAddress.trim()) return addr.fullAddress.trim();
    const parts = [addr.street, addr.city, addr.state, addr.zipCode ?? addr.zip].filter(
      (p) => p != null && String(p).trim() !== ""
    );
    return parts.length ? parts.join(", ") : "";
  }
  if (typeof addr === "string" && addr.trim()) return addr.trim();
  const flat = [school?.address, school?.city, school?.state, school?.zip].filter(
    (p) => p != null && String(p).trim() !== "" && typeof p !== "object"
  );
  return flat.length ? flat.join(", ") : "";
}

function MapFitBounds({ points, fallbackCenter, fallbackZoom = 11 }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 12);
      return;
    }
    if (fallbackCenter) {
      map.setView([fallbackCenter.lat, fallbackCenter.lng], fallbackZoom);
    }
  }, [map, points, fallbackCenter, fallbackZoom]);
  return null;
}

/**
 * Map for School Finder results (current page only). Requires valid Leaflet container size.
 */
export default function SchoolResultsMap({
  schools,
  searchCenter,
  getDetailPath,
  primaryColor = "#2563eb",
  onMarkerSelect,
}) {
  const mappable = useMemo(() => {
    const out = [];
    for (const school of schools || []) {
      const pos = getSchoolLatLng(school);
      if (pos) out.push({ school, ...pos });
    }
    return out;
  }, [schools]);

  const fitPoints = useMemo(() => mappable.map(({ lat, lng }) => ({ lat, lng })), [mappable]);

  const initialCenter = useMemo(() => {
    if (fitPoints.length === 1) return [fitPoints[0].lat, fitPoints[0].lng];
    if (searchCenter) return [searchCenter.lat, searchCenter.lng];
    if (fitPoints[0]) return [fitPoints[0].lat, fitPoints[0].lng];
    return [39.8283, -98.5795];
  }, [fitPoints, searchCenter]);

  const initialZoom = fitPoints.length === 1 ? 12 : searchCenter || fitPoints.length ? 11 : 4;

  if (!searchCenter && fitPoints.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        No schools on this page have map coordinates. Try another page or check imported school data.
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
      <p className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100 bg-gray-50">
        Map shows this page of results
        {mappable.length < (schools?.length || 0) && (
          <span className="text-amber-700">
            {" "}
            · {schools.length - mappable.length} school(s) without valid coordinates omitted
          </span>
        )}
      </p>
      <div className="h-[240px] sm:h-[300px] lg:h-[min(480px,calc(100vh-14rem))] w-full [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:z-0">
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          className="h-full w-full z-0"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFitBounds points={fitPoints} fallbackCenter={searchCenter} fallbackZoom={11} />
          {mappable.map(({ school, lat, lng }) => {
            const id = school._id;
            const path = getDetailPath(id);
            const addressStr = formatAddressLine(school);
            return (
              <Marker
                key={String(id)}
                position={[lat, lng]}
                eventHandlers={{
                  click: () => onMarkerSelect?.(String(id)),
                }}
              >
                <Popup>
                  <div className="min-w-[160px] max-w-[220px]">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {school.schoolName || "School"}
                    </p>
                    {addressStr && <p className="text-xs text-gray-600 mt-1">{addressStr}</p>}
                    {path && (
                      <Link
                        to={path}
                        className="inline-block mt-2 text-xs font-medium underline"
                        style={{ color: primaryColor }}
                      >
                        View details
                      </Link>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
