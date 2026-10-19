import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../../context/ContentContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Navigation,
  LocateFixed,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  RefreshCw,
  Sun,
  Moon,
  CloudRain
} from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { Card3D } from '../ui/Card3D';
import { PerspectiveHeading } from '../ui/PerspectiveText';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];
const SOLUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface ResolvedPlaceData {
  location: LatLngLiteral | { lat: () => number; lng: () => number };
  displayName?: string | null;
  formattedAddress?: string | null;
  googleMapsURI?: string | null;
}

interface WeatherApiResponse {
  currentTime?: string;
  timeZone?: {
    id?: string;
  };
  isDaytime?: boolean;
  weatherCondition?: {
    iconBaseUri?: string;
    description?: {
      text?: string;
      languageCode?: string;
    };
    type?: string;
  };
  temperature?: {
    degrees?: number;
    unit?: string;
  };
  feelsLikeTemperature?: {
    degrees?: number;
    unit?: string;
  };
  relativeHumidity?: number;
  uvIndex?: number;
  cloudCover?: number;
  precipitation?: {
    probability?: {
      percent?: number;
      type?: string;
    };
    qpf?: {
      quantity?: number;
      unit?: string;
    };
  };
  airPressure?: {
    meanSeaLevelMillibars?: number;
  };
  wind?: {
    direction?: {
      degrees?: number;
      cardinal?: string;
    };
    speed?: {
      value?: number;
      unit?: string;
    };
    gust?: {
      value?: number;
      unit?: string;
    };
  };
  visibility?: {
    distance?: number;
    unit?: string;
  };
  currentConditionsHistory?: {
    maxTemperature?: {
      degrees?: number;
      unit?: string;
    };
    minTemperature?: {
      degrees?: number;
      unit?: string;
    };
  };
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function extractLatLng(
  loc: LatLngLiteral | { lat: () => number; lng: () => number }
): LatLngLiteral {
  const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat;
  const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng;
  return { lat, lng };
}

function formatCardinalDirection(cardinal?: string): string {
  if (!cardinal) return '';
  const map: Record<string, string> = {
    NORTH: 'N',
    NORTH_NORTHEAST: 'NNE',
    NORTHEAST: 'NE',
    EAST_NORTHEAST: 'ENE',
    EAST: 'E',
    EAST_SOUTHEAST: 'ESE',
    SOUTHEAST: 'SE',
    SOUTH_SOUTHEAST: 'SSE',
    SOUTH: 'S',
    SOUTH_SOUTHWEST: 'SSW',
    SOUTHWEST: 'SW',
    WEST_SOUTHWEST: 'WSW',
    WEST: 'W',
    WEST_NORTHWEST: 'WNW',
    NORTHWEST: 'NW',
    NORTH_NORTHWEST: 'NNW'
  };
  return map[cardinal] || cardinal.replace(/_/g, ' ');
}

interface OfficeLocationMapInnerProps {
  addressQuery: string;
  firmName: string;
  onCoordinatesResolved?: (coords: LatLngLiteral) => void;
}

const OfficeLocationMapInner: React.FC<OfficeLocationMapInnerProps> = ({
  addressQuery,
  firmName,
  onCoordinatesResolved
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [resolvedPlace, setResolvedPlace] = useState<ResolvedPlaceData | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const resolveOfficeAddress = useCallback(async () => {
    if (!placesLib || !map) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      // Modern Places API (New) Text Search: https://developers.google.com/maps/documentation/javascript/place-search?utm_campaign=gmp_mcp_codeassist_v1_aistudio
      const request = {
        textQuery: addressQuery,
        fields: ['displayName', 'formattedAddress', 'location', 'viewport', 'googleMapsURI'],
        maxResultCount: 1,
        region: 'au',
        internalUsageAttributionIds: ATTRIBUTION_IDS
      };

      const { places } = await (placesLib.Place as any).searchByText(request);
      const firstPlace = places?.[0];

      if (firstPlace && firstPlace.location) {
        const coords = extractLatLng(firstPlace.location);
        setResolvedPlace({
          location: firstPlace.location,
          displayName: firstPlace.displayName,
          formattedAddress: firstPlace.formattedAddress,
          googleMapsURI: firstPlace.googleMapsURI
        });

        onCoordinatesResolved?.(coords);

        if (firstPlace.viewport) {
          map.fitBounds(firstPlace.viewport);
          map.setZoom(16);
        } else {
          map.setCenter(firstPlace.location);
          map.setZoom(16);
        }
      } else {
        setSearchError('Location could not be resolved from Places API.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes('OVER_QUERY_LIMIT') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('QuotaExceededError') ||
        msg.includes('429')
      ) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      setSearchError('Unable to resolve map coordinates right now.');
    } finally {
      setIsSearching(false);
    }
  }, [placesLib, map, addressQuery, onCoordinatesResolved]);

  useEffect(() => {
    void resolveOfficeAddress();
  }, [resolveOfficeAddress]);

  const handleRecenter = () => {
    if (map && resolvedPlace?.location) {
      map.panTo(resolvedPlace.location);
      map.setZoom(16);
      setInfoWindowOpen(true);
    }
  };

  return (
    <div className="relative h-[360px] sm:h-[420px] w-full">
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={{ lat: 0, lng: 0 }}
        defaultZoom={2}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        internalUsageAttributionIds={ATTRIBUTION_IDS}
        className="w-full h-full"
      >
        {resolvedPlace?.location && (
          <>
            <AdvancedMarker
              ref={markerRef}
              position={resolvedPlace.location}
              title={firmName}
              onClick={() => setInfoWindowOpen(true)}
            >
              <Pin
                background="#245237"
                borderColor="#15233c"
                glyphColor="#ffffff"
                scale={1.25}
              />
            </AdvancedMarker>

            {infoWindowOpen && marker && (
              <InfoWindow
                anchor={marker}
                maxWidth={280}
                onCloseClick={() => setInfoWindowOpen(false)}
              >
                <div className="p-1 text-[#15233c]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#245237] mb-0.5">
                    {firmName}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug mb-1.5">
                    {resolvedPlace.formattedAddress || addressQuery}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Google Maps
                  </p>
                  {resolvedPlace.googleMapsURI && (
                    <a
                      href={resolvedPlace.googleMapsURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#245237] hover:underline"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </Map>

      {/* Map Floating Controls & Status Overlay */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto flex flex-wrap items-center gap-2 pointer-events-none">
        {resolvedPlace?.location && (
          <button
            type="button"
            onClick={handleRecenter}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 dark:bg-[#111C2E]/95 backdrop-blur-md text-xs font-semibold text-[#15233c] dark:text-white border border-slate-200/80 dark:border-slate-700 shadow-lg hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <LocateFixed className="w-3.5 h-3.5 text-[#245237] dark:text-[#21afc2]" />
            <span>Center on Office</span>
          </button>
        )}

        {resolvedPlace?.googleMapsURI && (
          <a
            href={resolvedPlace.googleMapsURI}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] text-white dark:text-[#0b111e] text-xs font-semibold shadow-lg transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
        )}
      </div>

      {isSearching && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-[#111C2E]/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
          Locating {addressQuery}...
        </div>
      )}

      {searchError && !isSearching && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-amber-50/95 dark:bg-amber-950/90 border border-amber-200 dark:border-amber-800 text-xs font-medium text-amber-800 dark:text-amber-200 shadow-sm">
          {searchError}
        </div>
      )}
    </div>
  );
};

interface GreenbankWeatherWidgetProps {
  coordinates: LatLngLiteral | null;
}

const GreenbankWeatherWidget: React.FC<GreenbankWeatherWidgetProps> = ({ coordinates }) => {
  const [unitsSystem, setUnitsSystem] = useState<'METRIC' | 'IMPERIAL'>('METRIC');
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [iconLoadFailed, setIconLoadFailed] = useState<boolean>(false);

  const fetchCurrentWeather = useCallback(async () => {
    if (!GOOGLE_MAPS_API_KEY || !coordinates) return;

    setLoading(true);
    setError(null);
    setIconLoadFailed(false);

    try {
      // Google Maps Platform Weather API Current Conditions lookup:
      // https://developers.google.com/maps/documentation/weather/reference/rest/v1/currentConditions/lookup?utm_campaign=gmp_mcp_codeassist_v1_aistudio
      const url = new URL('https://weather.googleapis.com/v1/currentConditions:lookup');
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('location.latitude', String(coordinates.lat));
      url.searchParams.set('location.longitude', String(coordinates.lng));
      if (unitsSystem === 'IMPERIAL') {
        url.searchParams.set('unitsSystem', 'IMPERIAL');
      }

      const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-Goog-Maps-Solution-ID': SOLUTION_ID
        }
      });

      const data = (await res.json()) as WeatherApiResponse;

      if (res.status === 429 || data?.error?.status === 'RESOURCE_EXHAUSTED') {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        setError('Weather service quota limit reached.');
        return;
      }

      if (!res.ok || data?.error) {
        setError(data?.error?.message || 'Unable to retrieve current weather for Greenbank, QLD.');
        return;
      }

      setWeather(data);
    } catch {
      setError('Unable to connect to the weather service right now.');
    } finally {
      setLoading(false);
    }
  }, [coordinates, unitsSystem]);

  useEffect(() => {
    if (coordinates) {
      void fetchCurrentWeather();
    }
  }, [coordinates, fetchCurrentWeather]);

  const tempSymbol = unitsSystem === 'IMPERIAL' ? '°F' : '°C';
  const speedUnit = unitsSystem === 'IMPERIAL' ? 'mph' : 'km/h';
  const visibilityUnit = unitsSystem === 'IMPERIAL' ? 'mi' : 'km';

  const localTimeFormatted = (() => {
    const tz = weather?.timeZone?.id || 'Australia/Brisbane';
    try {
      return new Intl.DateTimeFormat('en-AU', {
        timeZone: tz,
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date());
    } catch {
      return 'AEST (QLD)';
    }
  })();

  const iconUrl = weather?.weatherCondition?.iconBaseUri
    ? `${weather.weatherCondition.iconBaseUri}.svg`
    : null;

  return (
    <Card3D maxTilt={5} scale={1.01} className="w-full">
      <div className="bg-white dark:bg-[#111C2E] p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-5">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#245237] dark:text-[#21afc2]">
                <CloudSun className="w-3.5 h-3.5" />
                <span>Localized Weather</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {localTimeFormatted}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#15233c] dark:text-white mt-1 font-display">
              Greenbank, QLD 4124
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Unit Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-[#070d18] p-0.5 border border-slate-200/70 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUnitsSystem('METRIC')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                  unitsSystem === 'METRIC'
                    ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#15233c] dark:hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setUnitsSystem('IMPERIAL')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                  unitsSystem === 'IMPERIAL'
                    ? 'bg-[#245237] dark:bg-[#21afc2] text-white dark:text-[#070d18] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#15233c] dark:hover:text-white'
                }`}
              >
                °F
              </button>
            </div>

            <button
              type="button"
              onClick={() => void fetchCurrentWeather()}
              disabled={loading || !coordinates}
              title="Refresh current weather"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070d18] text-slate-600 dark:text-slate-300 hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Body States */}
        {!GOOGLE_MAPS_API_KEY ? (
          <div className="py-4 text-xs text-slate-500 dark:text-slate-400">
            Weather API key is not configured.
          </div>
        ) : !coordinates || (loading && !weather) ? (
          <div className="py-6 flex items-center justify-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin text-[#245237] dark:text-[#21afc2]" />
            <span>Loading real-time conditions for Greenbank, QLD...</span>
          </div>
        ) : error ? (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void fetchCurrentWeather()}
              className="font-semibold underline shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : weather ? (
          <>
            {/* Primary Temperature & Condition Row */}
            <div className="flex items-center justify-between gap-4 bg-gradient-to-br from-emerald-50/80 via-slate-50 to-white dark:from-[#0B1526] dark:via-[#0D192B] dark:to-[#111C2E] p-4 rounded-2xl border border-emerald-100/80 dark:border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#070d18] border border-slate-200/70 dark:border-slate-800 flex items-center justify-center shadow-xs shrink-0">
                  {iconUrl && !iconLoadFailed ? (
                    <img
                      src={iconUrl}
                      alt={weather.weatherCondition?.description?.text || 'Weather condition'}
                      className="w-9 h-9 object-contain"
                      onError={() => setIconLoadFailed(true)}
                    />
                  ) : weather.isDaytime === false ? (
                    <Moon className="w-7 h-7 text-[#21afc2]" />
                  ) : (
                    <Sun className="w-7 h-7 text-amber-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#15233c] dark:text-white tabular-nums tracking-tight font-display">
                      {weather.temperature?.degrees !== undefined
                        ? `${Math.round(weather.temperature.degrees)}${tempSymbol}`
                        : '--'}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-950/70 text-[#245237] dark:text-[#21afc2]">
                      {weather.isDaytime === false ? 'Night' : 'Daytime'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    {weather.weatherCondition?.description?.text || 'Current Conditions'}
                  </p>
                </div>
              </div>

              <div className="text-right text-xs space-y-1">
                {weather.feelsLikeTemperature?.degrees !== undefined && (
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    Feels like{' '}
                    <span className="font-bold text-[#15233c] dark:text-white tabular-nums">
                      {Math.round(weather.feelsLikeTemperature.degrees)}
                      {tempSymbol}
                    </span>
                  </p>
                )}
                {weather.currentConditionsHistory?.maxTemperature?.degrees !== undefined &&
                  weather.currentConditionsHistory?.minTemperature?.degrees !== undefined && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      H: {Math.round(weather.currentConditionsHistory.maxTemperature.degrees)}
                      {tempSymbol} · L:{' '}
                      {Math.round(weather.currentConditionsHistory.minTemperature.degrees)}
                      {tempSymbol}
                    </p>
                  )}
              </div>
            </div>

            {/* 4-Metric Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1320] border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2]">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Humidity
                  </span>
                  <span className="text-xs font-bold text-[#15233c] dark:text-white tabular-nums">
                    {weather.relativeHumidity !== undefined ? `${weather.relativeHumidity}%` : '--'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1320] border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2]">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Wind
                  </span>
                  <span className="text-xs font-bold text-[#15233c] dark:text-white tabular-nums">
                    {weather.wind?.speed?.value !== undefined
                      ? `${Math.round(weather.wind.speed.value)} ${speedUnit} ${formatCardinalDirection(weather.wind.direction?.cardinal)}`.trim()
                      : '--'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1320] border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2]">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Precipitation
                  </span>
                  <span className="text-xs font-bold text-[#15233c] dark:text-white tabular-nums">
                    {weather.precipitation?.probability?.percent !== undefined
                      ? `${weather.precipitation.probability.percent}% chance`
                      : '0% chance'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1320] border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2]">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Visibility & UV
                  </span>
                  <span className="text-xs font-bold text-[#15233c] dark:text-white tabular-nums">
                    {weather.visibility?.distance !== undefined
                      ? `${Math.round(weather.visibility.distance)} ${visibilityUnit}`
                      : '--'}{' '}
                    · UV {weather.uvIndex ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Thermometer className="w-3 h-3 text-[#245237] dark:text-[#21afc2]" />
                {weather.airPressure?.meanSeaLevelMillibars !== undefined
                  ? `Pressure: ${Math.round(weather.airPressure.meanSeaLevelMillibars)} hPa`
                  : 'Greenbank Station'}
                {weather.cloudCover !== undefined ? ` · Cloud cover ${weather.cloudCover}%` : ''}
              </span>
              <span>Google Weather API</span>
            </div>
          </>
        ) : null}
      </div>
    </Card3D>
  );
};

export const ContactPage: React.FC = () => {
  const { content, showToast } = useContent();
  const { contact } = content;

  const officeAddress =
    contact.officeAddress || '102 Anderson Drive Greenbank, QLD 4124, Australia';

  const [officeCoords, setOfficeCoords] = useState<LatLngLiteral | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'strategy',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide message details (minimum 10 characters)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitted(true);
    showToast('Inquiry sent successfully! Our team will respond shortly.');
  };

  return (
    <div className="py-12 lg:py-16 bg-[#f6f7fc] dark:bg-[#070d18] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-14 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-2">
            <span>Get In Touch</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
            <span>Contact Us</span>
          </div>

          <PerspectiveHeading
            text={contact.title}
            as="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15233c] dark:text-white tracking-tight mb-4 [text-wrap:balance] font-display"
          />

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {contact.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details, Localized Weather & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <Card3D maxTilt={6} scale={1.01} className="w-full">
              <div className="bg-white dark:bg-[#111C2E] p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                <h2 className="text-lg font-bold text-[#15233c] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 font-display">
                  Headquarters & Direct Channels
                </h2>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Office Address</span>
                    <p className="text-sm font-semibold text-[#15233c] dark:text-white mt-0.5">
                      {officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Direct Telephone</span>
                    <a 
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} 
                      className="text-sm font-semibold text-[#15233c] dark:text-white hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors tabular-nums mt-0.5 block"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Inquiries Email</span>
                    <a 
                      href={`mailto:${contact.email}`} 
                      className="text-sm font-semibold text-[#15233c] dark:text-white hover:text-[#245237] dark:hover:text-[#21afc2] transition-colors mt-0.5 block"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#245237] dark:text-[#21afc2] border border-emerald-100 dark:border-emerald-800/80 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Working Hours</span>
                    <p className="text-sm font-semibold text-[#15233c] dark:text-white mt-0.5">
                      {contact.hours}
                    </p>
                  </div>
                </div>
              </div>
            </Card3D>

            {/* Localized Greenbank, QLD Weather Widget */}
            <GreenbankWeatherWidget coordinates={officeCoords} />

            {/* Probity & Confidentiality Assurance */}
            <div className="p-6 rounded-3xl bg-[#15233c] dark:bg-[#0B111E] text-white border border-white/10 dark:border-slate-800 shadow-xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#21afc2] block mb-1">
                Probity & Confidentiality
              </span>
              <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
                Bombheq Partners guarantees strict confidentiality and compliance across all government probity requirements and tender processes.
              </p>
            </div>

          </div>

          {/* Interactive Form with Dark Mode Inputs */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111C2E] p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
            
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#245237] dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#15233c] dark:text-white mb-2 font-display">
                  Inquiry Received
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                  Thank you, <strong>{formData.name}</strong>. A senior infrastructure advisor from Bombheq Partners will review your message and contact you within one business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      serviceInterest: 'strategy',
                      subject: '',
                      message: ''
                    });
                  }}
                  className="px-6 py-3 text-xs font-semibold text-[#245237] dark:text-[#21afc2] bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-all cursor-pointer transform hover:-translate-y-0.5 border border-emerald-200 dark:border-emerald-800"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#15233c] dark:text-white mb-1 font-display">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All fields marked with an asterisk (*) are required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Eleanor Rigby"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white ${
                        errors.name 
                          ? 'border-red-500 bg-red-50/30' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. eleanor@agency.gov.au"
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white ${
                        errors.email 
                          ? 'border-red-500 bg-red-50/30' 
                          : 'border-slate-200 dark:border-slate-700 focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+61 400 000 000"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Advisory Discipline
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={e => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20 focus:outline-none"
                    >
                      <option value="strategy">Strategy & Policy Advice</option>
                      <option value="transaction">Procurement & Transaction</option>
                      <option value="disputes">Contract Disputes & Expert Witness</option>
                      <option value="commercial">Commercial & Delivery Governance</option>
                      <option value="careers">Careers & Joining the Team</option>
                      <option value="other">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of project or requirement"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your infrastructure initiative, timeframe, or specific advisory need..."
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all focus:outline-none bg-white dark:bg-[#070d18] text-[#15233c] dark:text-white ${
                      errors.message 
                        ? 'border-red-500 bg-red-50/30' 
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#245237] dark:focus:border-[#21afc2] focus:ring-2 focus:ring-[#21afc2]/20'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold text-white bg-[#245237] hover:bg-[#1b3e2a] dark:bg-[#21afc2] dark:hover:bg-[#1994a5] dark:text-[#0b111e] rounded-xl transition-all transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Advisory Request</span>
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Interactive Headquarters Location Map Section */}
        <div className="mt-12 bg-white dark:bg-[#111C2E] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#245237] dark:text-[#21afc2] mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Head Office Location</span>
              </div>
              <h2 className="text-xl font-bold text-[#15233c] dark:text-white font-display">
                {officeAddress}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Interactive location map powered by Google Maps
              </p>
            </div>
          </div>

          {GOOGLE_MAPS_API_KEY ? (
            <APIProvider
              apiKey={GOOGLE_MAPS_API_KEY}
              region="AU"
              language="en"
              libraries={['places', 'marker']}
            >
              <OfficeLocationMapInner
                addressQuery={officeAddress}
                firmName={content.company.name || 'Bombheq Partners'}
                onCoordinatesResolved={setOfficeCoords}
              />
            </APIProvider>
          ) : (
            <div className="h-[340px] flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-[#0B111E]">
              <MapPin className="w-10 h-10 text-[#245237] dark:text-[#21afc2] mb-3 opacity-80" />
              <p className="text-sm font-semibold text-[#15233c] dark:text-white mb-1">
                {officeAddress}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Google Maps API key (`VITE_GOOGLE_MAPS_API_KEY`) is not configured in the environment.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

