import React, { useEffect, useState, useRef } from "react";
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
  const [mode, setMode] = useState("venue"); // 'venue' or 'event'
  const [eventQuery, setEventQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(true);
  const mapRef = useRef(null);

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
        const localEventsUrl = "/events.json";
        const fetchUrl = import.meta.env.DEV
          ? localEventsUrl
          : API_ENDPOINTS.PUBLIC_EVENTS;
        const res = await axios.get(fetchUrl);
        const data = Array.isArray(res.data) ? res.data : [];
        setEvents(data);

        const venueSet = new Map();
        data.forEach((ev) => {
          const name = ev.venue || ev.location || ""; // don't add Unknown Venue placeholder
          if (!name || name.trim().length === 0) return;
          if (!venueSet.has(name)) {
            venueSet.set(name, {
              name,
              lat: ev.latitude || ev.lat || null,
              lng: ev.longitude || ev.lng || null,
              address: ev.location || ev.venue || "",
            });
          }
        });

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
          "NLHC 104",
          "EED SEMINAR HALL",
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
          "ECED BLOCK 2 SEMINAR HALL",
          "ELHC 102",
          "NLHC 301",
          "MAIN BUILDING 109",
          "ELHC 302",
          "BASKETBALL COURT",
          "NLHC 302",
        ];

        const fixedVenueNames = Array.from(
          new Set(
            fixedVenueNamesRaw.map((s) => (s || "").trim()).filter(Boolean)
          )
        );

        const fixedSet = new Set(fixedVenueNames);

        const fixedVenues = fixedVenueNames.map((name) =>
          venueSet.has(name)
            ? venueSet.get(name)
            : { name, address: "", lat: null, lng: null }
        );

        const remaining = Array.from(venueSet.values()).filter(
          (v) => !fixedSet.has(v.name)
        );
        const venueArray = [...fixedVenues, ...remaining];
        setVenues(venueArray);
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

  const venueMeta = venues.find((v) => v.name === selectedVenue);
  const hasLocation = Boolean(
    (venueMeta && venueMeta.lat && venueMeta.lng) ||
      (venueMeta && venueMeta.address && venueMeta.address.trim().length > 0)
  );
  const mapSrc = (() => {
    const selectedEvent = events.find(
      (ev) => (ev.id || ev._id) === selectedEventId
    );
    if (selectedEvent) {
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
    if (venueMeta.mapUrl && venueMeta.mapUrl.trim().length > 0)
      return venueMeta.mapUrl;
    if (venueMeta.lat && venueMeta.lng)
      return `https://www.google.com/maps?q=${venueMeta.lat},${venueMeta.lng}&z=17&output=embed`;
    if (venueMeta.address && venueMeta.address.trim().length > 0)
      return `https://www.google.com/maps?q=${encodeURIComponent(
        venueMeta.address || venueMeta.name
      )}&z=15&output=embed`;
    return "";
  })();

  // On mobile, when selection changes (venue or event), scroll map into view
  useEffect(() => {
    try {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (!isMobile) return;
      if (!mapRef.current) return;
      // Smooth scroll to the map container
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      // ignore errors
    }
  }, [selectedVenue, selectedEventId]);

  const listToRender =
    mode === "event" && eventQuery.trim().length > 0
      ? events.filter((ev) => {
          const q = eventQuery.trim().toLowerCase();
          const inTitle = (ev.title || "").toLowerCase().includes(q);
          const inSpeaker = (ev.speaker || "").toLowerCase().includes(q);
          const inVenue = (ev.venue || ev.location || "")
            .toLowerCase()
            .includes(q);
          return inTitle || inSpeaker || inVenue;
        })
      : events;

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
                  <div className="mt-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Search options</div>
                      <div className="text-xs text-gray-400">Choose mode</div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setMode("venue")}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                          mode === "venue"
                            ? "bg-[#fe4a56] text-white border-[#fe4a56]"
                            : "text-gray-300 border-gray-700/40"
                        }`}
                      >
                        Search by Venue
                      </button>
                      <button
                        onClick={() => setMode("event")}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                          mode === "event"
                            ? "bg-[#fe4a56] text-white border-[#fe4a56]"
                            : "text-gray-300 border-gray-700/40"
                        }`}
                      >
                        Search by Event
                      </button>
                    </div>

                    {mode === "venue" ? (
                      <>
                        <label className="block text-sm font-medium text-gray-300 mt-4 mb-2">
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
                        <div className="mt-3 text-xs text-gray-400">
                          <div className="font-medium">
                            Events at this venue
                          </div>
                          <div className="text-xs text-gray-400">
                            {eventsForSelectedVenue.length} event(s)
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 text-xs text-gray-400">
                        <div className="font-medium">Search events</div>
                        <div className="text-xs mt-1 relative">
                          <input
                            value={eventQuery}
                            onChange={(e) => setEventQuery(e.target.value)}
                            placeholder="Search by event title, speaker or venue"
                            className="w-full bg-transparent border border-gray-700/40 px-3 py-2 rounded-lg text-white focus:outline-none pr-10"
                          />
                          {eventQuery && (
                            <button
                              onClick={() => {
                                setEventQuery("");
                                setSelectedEventId(null);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              aria-label="Clear search"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {/* No-results message when search active but no matches */}
                        {mode === "event" &&
                          eventQuery.trim() &&
                          listToRender.length === 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                              No events match your search.
                              <button
                                onClick={() => {
                                  setEventQuery("");
                                  setSelectedEventId(null);
                                }}
                                className="ml-2 text-sm text-[#fe4a56] underline"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                      </div>
                    )}
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
                        listToRender.map((ev) => {
                          const evId = ev.id || ev._id;
                          const evVenue = ev.venue || ev.location || "";
                          const isSelected = selectedEventId === evId;
                          return (
                            <button
                              key={evId}
                              onClick={() => {
                                const nextSelected = isSelected ? null : evId;
                                setSelectedEventId(nextSelected);
                                if (nextSelected) {
                                  setMode("event");
                                  if (evVenue && evVenue.trim().length > 0)
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
                    <div
                      ref={mapRef}
                      className="mt-4 flex-1 min-h-[420px] rounded-lg overflow-hidden border border-gray-700/30 flex flex-col"
                    >
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
