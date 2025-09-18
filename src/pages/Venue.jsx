import React, { useEffect, useState } from "react";
import {
  FiMapPin,
  FiClock,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";
import BgAnimation from "../components/BgAnimation";
import Header2 from "../components/Header2";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

function Venue() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) setIsScrolled(true);
      else setIsScrolled(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        // Prefer a local static events file if present (useful for local testing).
        const localEventsUrl = "/events.json";
        const fetchUrl = import.meta.env.DEV
          ? localEventsUrl
          : API_ENDPOINTS.PUBLIC_EVENTS;
        const res = await axios.get(fetchUrl);
        const data = Array.isArray(res.data) ? res.data : [];
        setEvents(data);

        // Extract unique venue names from event.location (or event.venue)
        const venueSet = new Map();
        data.forEach((ev) => {
          const name = ev.venue || ev.location || ""; // don't add Unknown Venue placeholder
          // skip empty/unknown names
          if (!name || name.trim().length === 0) return;
          // If event has coordinates or map info, keep one example
          if (!venueSet.has(name)) {
            venueSet.set(name, {
              name,
              // Try to parse lat/lng if provided in event.meta or ev.coordinates
              lat: ev.latitude || ev.lat || null,
              lng: ev.longitude || ev.lng || null,
              address: ev.location || ev.venue || "",
            });
          }
        });

        // Replace venue list with the fixed ordered list provided by organizers.
        // If an event provided metadata for a matching venue name (lat/lng/address), keep it.
        const fixedVenueNamesRaw = [
          "OAT",
          "ARYABHATTA HALL",
          "BHASKARA HALL",
          "ELHC 201",
          "ELHC 101",
          "MED SEMINAR HALL",
          "NLHC 201, 202, 203,204",
          "VLSI LAB",
          "CHANAKYA HALL",
          "ELHC 301",
          "ELHC 402",
          "ELHC 403",
          "ELHC 401",
          "AMPHITHEATRE",
          "FOOTBALL GROUND",
          "AUDITORIUM",
          "AUDITORIUM",
          "AUDITORIUM",
          "AUDITORIUM",
          "AUDITORIUM",
          "AUDITORIUM",
          "AUDITORIUM",
          "AUDITORIUM",
          "NLHC 104",
          "EED SEMINAR HALL",
          "AUDITORIUM",
          "NEAR A HOSTEL X INFORMAL STAGE",
          "ELHC 203",
          "NLHC 103",
          "CADCAM LAB",
          "NLHC 204",
          "ELHC 104",
          "ELHC 202",
          "ELHC 103",
          "KHOKHO COURT",
          "CREATIVE ZONE",
          "NEAR AUDITORIUM",
          "NEAR AUDITORIUM",
          "NEAR AUDITORIUM",
          "ECED BLOCK 2 SEMINAR HALL",
          "ELHC 202",
          "ELHC 102",
          "NLHC 301",
          "MAIN BUILDING 109",
          "ELHC 202",
          "ELHC 302",
          "AUDITORIUM",
          "BASKETBALL COURT",
          "NLHC 302",
          "ELHC 301",
          "AUDITORIUM",
        ];

        // Normalize and deduplicate preserving the original order
        const fixedVenueNames = Array.from(
          new Set(
            fixedVenueNamesRaw.map((s) => (s || "").trim()).filter(Boolean)
          )
        );

        const fixedSet = new Set(fixedVenueNames);

        // Build ordered venue array: for each fixed name, use existing metadata if present, else create a placeholder.
        const fixedVenues = fixedVenueNames.map((name) =>
          venueSet.has(name)
            ? venueSet.get(name)
            : { name, address: "", lat: null, lng: null }
        );

        // Append any additional venues discovered from events that aren't in the fixed list
        const remaining = Array.from(venueSet.values()).filter(
          (v) => !fixedSet.has(v.name)
        );

        const venueArray = [...fixedVenues, ...remaining];
        setVenues(venueArray);
        // default select first fixed venue if available
        if (venueArray.length > 0) setSelectedVenue(venueArray[0].name);
      } catch (err) {
        setError("Failed to load venues.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const eventsForSelectedVenue = events.filter((ev) => {
    const name = ev.venue || ev.location || "";
    if (!name || name.trim().length === 0) return false;
    return name === selectedVenue;
  });

  // Sort events by startTime ascending for schedule display
  eventsForSelectedVenue.sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : Infinity;
    const tb = b.startTime ? new Date(b.startTime).getTime() : Infinity;
    return ta - tb;
  });

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
      const d = new Date(dateTimeString);
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateTimeString;
    }
  };

  // Helpers to detect common start/end field names and return values
  const getEventStart = (ev) => {
    return (
      ev.startTime ||
      ev.start ||
      ev.start_time ||
      ev.startsAt ||
      ev.startDate ||
      ev.start_date ||
      ev.dateTime ||
      ev.datetime ||
      ev.date ||
      (ev.schedule && ev.schedule.start)
    );
  };

  const getEventEnd = (ev) => {
    return (
      ev.endTime ||
      ev.end ||
      ev.end_time ||
      ev.endsAt ||
      ev.endDate ||
      ev.end_date ||
      (ev.schedule && ev.schedule.end)
    );
  };

  const eventTimeRange = (ev) => {
    const s = getEventStart(ev);
    const e = getEventEnd(ev);
    if (!s && !e) return "TBA";
    if (s && !e) return formatTime(s);
    try {
      return `${formatTime(s)} - ${formatTime(e)}`;
    } catch {
      return formatTime(s) || "TBA";
    }
  };

  // Build Google Maps embed URL. If lat/lng present, use place by coordinates, otherwise use address text.
  const venueMeta = venues.find((v) => v.name === selectedVenue);
  const hasLocation = Boolean(
    (venueMeta && venueMeta.lat && venueMeta.lng) ||
      (venueMeta && venueMeta.address && venueMeta.address.trim().length > 0)
  );
  const mapSrc = (() => {
    // Prefer event-specific location if an event is selected
    const selectedEvent = events.find(
      (ev) => (ev.id || ev._id) === selectedEventId
    );
    if (selectedEvent) {
      // Prefer an explicit mapUrl on the event
      if (selectedEvent.mapUrl && selectedEvent.mapUrl.trim().length > 0)
        return selectedEvent.mapUrl;
      const evLat = selectedEvent.latitude || selectedEvent.lat || null;
      const evLng = selectedEvent.longitude || selectedEvent.lng || null;
      const evAddr = selectedEvent.location || selectedEvent.venue || "";
      if (evLat && evLng)
        return `https://www.google.com/maps?q=${evLat},${evLng}&z=17&output=embed`;
      if (evAddr && evAddr.trim().length > 0)
        return `https://www.google.com/maps?q=${encodeURIComponent(
          evAddr
        )}&z=15&output=embed`;
    }
    if (!venueMeta) return "";
    // Prefer an explicit mapUrl on the venue metadata
    if (venueMeta.mapUrl && venueMeta.mapUrl.trim().length > 0)
      return venueMeta.mapUrl;
    if (venueMeta.lat && venueMeta.lng) {
      return `https://www.google.com/maps?q=${venueMeta.lat},${venueMeta.lng}&z=17&output=embed`;
    }
    if (venueMeta.address && venueMeta.address.trim().length > 0) {
      const q = encodeURIComponent(venueMeta.address || venueMeta.name);
      return `https://www.google.com/maps?q=${q}&z=15&output=embed`;
    }
    return "";
  })();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="relative z-10 w-full">
        <Header2 isScrolled={isScrolled} />

        <div className="md:mt-20 mt-15 min-h-screen bg-black/20 backdrop-blur-sm p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-8" data-aos="fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-white flex items-center justify-center gap-3">
                <FiMapPin className="text-3xl text-[#fe4a56]" />
                Venues & Schedules
              </h2>
              <p className="text-white/80 mt-2 max-w-2xl mx-auto">
                Select a venue to view all scheduled events and the location on
                map.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Choose Venue
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-transparent border border-gray-700/40 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
                      value={selectedVenue}
                      onChange={(e) => setSelectedVenue(e.target.value)}
                    >
                      {venues.map((v) => (
                        <option
                          key={v.name}
                          value={v.name}
                          className="text-black"
                        >
                          {v.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-300 pointer-events-none" />
                  </div>

                  <div className="mt-4 text-sm text-gray-300">
                    <p className="font-medium">Events at this venue</p>
                    <p className="text-xs text-gray-400">
                      {eventsForSelectedVenue.length} event(s)
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-300 font-medium mb-2">
                      All events
                    </div>
                    <div className="space-y-2 max-h-64 overflow-auto pr-2">
                      {loading ? (
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="h-6 w-6 rounded-full border-2 border-[#fe4a56] border-t-transparent animate-spin"></div>
                          Loading events...
                        </div>
                      ) : error ? (
                        <div className="text-red-400">{error}</div>
                      ) : events.length === 0 ? (
                        <div className="text-gray-400">
                          No events available.
                        </div>
                      ) : (
                        events.map((ev) => {
                          const evId = ev.id || ev._id;
                          const evVenue = ev.venue || ev.location || "";
                          const isSelected = selectedEventId === evId;
                          return (
                            <button
                              key={evId}
                              onClick={() => {
                                // select the event and set the venue to the event's venue (if available)
                                setSelectedEventId(isSelected ? null : evId);
                                if (evVenue && evVenue.trim().length > 0) {
                                  setSelectedVenue(evVenue);
                                }
                              }}
                              className={`w-full text-left flex items-start gap-3 bg-black/30 p-3 rounded-lg border ${
                                isSelected
                                  ? "border-[#fe4a56]"
                                  : "border-gray-700/40"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                <FiClock className="text-[#fe4a56] mt-1" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <h4 className="text-sm font-semibold text-white line-clamp-2">
                                    {ev.title}
                                  </h4>
                                  <span className="text-xs text-gray-400">
                                    {eventTimeRange(ev)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                                  {ev.description}
                                </p>
                                {evVenue && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {evVenue}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {selectedVenue || "Select a venue"}
                      </h3>
                      <p className="text-sm text-gray-400">Location & map</p>
                    </div>
                    <div className="text-right">
                      {selectedEventId ? (
                        (() => {
                          const ev = events.find(
                            (e) => (e.id || e._id) === selectedEventId
                          );
                          if (!ev) return null;
                          return (
                            <div className="text-sm">
                              <div className="text-xs text-gray-400">
                                Selected event
                              </div>
                              <div className="font-semibold text-white">
                                {ev.title}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {eventTimeRange(ev)}
                              </div>
                              {ev.location && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {ev.location}
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-sm text-gray-400">
                          No event selected
                        </div>
                      )}
                    </div>
                  </div>

                  {hasLocation || selectedEventId ? (
                    <div className="mt-4 flex-1 min-h-[420px] rounded-lg overflow-hidden border border-gray-700/30 flex flex-col">
                      <iframe
                        title="venue-map"
                        src={mapSrc}
                        className="w-full flex-1 h-full"
                        loading="lazy"
                        style={{ border: 0 }}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 flex-1 min-h-[160px] rounded-lg flex items-center justify-center border border-dashed border-gray-700/20 text-gray-500">
                      Location not provided for this venue
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-gray-300">
                      Upcoming events at{" "}
                      <span className="font-semibold">{selectedVenue}</span>
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {eventsForSelectedVenue.slice(0, 6).map((ev) => (
                        <div
                          key={ev.id || ev._id}
                          className="bg-black/30 p-3 rounded-lg border border-gray-700/40"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {ev.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {eventTimeRange(ev)}
                              </p>
                            </div>
                            <div className="text-xs text-gray-400">
                              {ev.speaker || ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Venue;
