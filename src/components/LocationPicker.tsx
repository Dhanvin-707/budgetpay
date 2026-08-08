"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default icon for bundlers — use CDN paths to avoid webpack image imports
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629] // roughly central India
const DEFAULT_ZOOM = 5

type Props = {
  /** Base name for hidden form inputs — renders `<input name="${name}">`, `<input name="latitude">`, `<input name="longitude">` */
  name?: string
}

export default function LocationPicker({ name = "address" }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; <a href=\"https://openstreetmap.org/copyright\">OpenStreetMap</a>",
    }).addTo(map)

    const marker = L.marker(DEFAULT_CENTER, { draggable: true }).addTo(map)
    markerRef.current = marker
    mapRef.current = map

    // Try to center on user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (mapRef.current !== map) return
          const { latitude, longitude } = pos.coords
          map.setView([latitude, longitude], 14)
          marker.setLatLng([latitude, longitude])
          reverseGeocode(latitude, longitude)
        },
        () => {} // ignore denial
      )
    }

    marker.on("dragend", () => {
      const { lat, lng } = marker.getLatLng()
      reverseGeocode(lat, lng)
    })

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng)
      reverseGeocode(e.latlng.lat, e.latlng.lng)
    })

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Invalidate size when container layout settles
  useEffect(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 300)
    return () => clearTimeout(timer)
  }, [])

  function geocodeAddress(q: string) {
    if (!q.trim()) return
    setBusy(true)
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.length) return
        const { lat: latStr, lon: lonStr, display_name } = data[0]
        const latN = parseFloat(latStr)
        const lonN = parseFloat(lonStr)
        markerRef.current?.setLatLng([latN, lonN])
        mapRef.current?.setView([latN, lonN], 15)
        setInput(display_name)
        setLat(String(latN))
        setLng(String(lonN))
      })
      .finally(() => setBusy(false))
  }

  function reverseGeocode(latN: number, lonN: number) {
    setBusy(true)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latN}&lon=${lonN}&addressdetails=1`
    )
      .then((r) => r.json())
      .then((data) => {
        const addr = data.display_name || `${latN}, ${lonN}`
        setInput(addr)
        setLat(String(latN))
        setLng(String(lonN))
      })
      .finally(() => setBusy(false))
  }

  function handleInput(val: string) {
    setInput(val)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => geocodeAddress(val), 600)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search location or type address…"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          className="pr-8"
        />
        {busy && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
            …
          </span>
        )}
      </div>
      <div ref={containerRef} className="h-64 w-full rounded-lg border border-border" />
      <input type="hidden" name={name} value={input} />
      <input type="hidden" name="latitude" value={lat} />
      <input type="hidden" name="longitude" value={lng} />
    </div>
  )
}
