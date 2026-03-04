import React from 'react';
import { motion } from 'framer-motion';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-50m.json';
import { CityData } from './IsraeliMap';

interface DesktopMapSvgProps {
    cities: CityData[];
    active: string | null;
    setActive: (id: string | null) => void;
}

const WIDTH = 460;
const HEIGHT = 650;

// Custom offsets for labels to prevent overlapping
const LABEL_OFFSETS: Record<string, { x: number; y: number }> = {
    haifa: { x: 0, y: -50 },
    netanya: { x: -110, y: -25 },
    telaviv: { x: -115, y: 10 },
    jerusalem: { x: 85, y: -5 },
    ashdod: { x: -105, y: 50 },
    beersheva: { x: 0, y: 55 },
};

const projection = geoMercator()
    .center([35.12, 31.55])
    .scale(8500)
    .translate([WIDTH / 2, HEIGHT / 2]);

const pathGenerator = geoPath(projection);

// Israel accurate shape from world-atlas GeoJSON (ISO 3166-1 numeric = "376")
const countriesGeo = feature(worldData as any, (worldData as any).objects.countries);
const israelFeature = (countriesGeo as any).features.find((f: any) => f.id === '376');
const palestineFeature = (countriesGeo as any).features.find((f: any) => f.id === '275');

let combinedPath = israelFeature ? (pathGenerator(israelFeature) ?? '') : '';

// Add Judea and Samaria (West Bank) which is the larger polygon in the Palestinian territories data
if (palestineFeature && palestineFeature.geometry && palestineFeature.geometry.type === 'MultiPolygon') {
    const westBankFeature = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: palestineFeature.geometry.coordinates[1]
        },
        properties: {}
    };
    combinedPath += ' ' + (pathGenerator(westBankFeature as any) ?? '');
}

const ISRAEL_PATH_D: string = combinedPath;

function project(lng: number, lat: number): [number, number] {
    const pt = projection([lng, lat]);
    return pt ? [pt[0], pt[1]] : [0, 0];
}

const DesktopMapSvg: React.FC<DesktopMapSvgProps> = ({ cities, active, setActive }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="hidden lg:flex justify-center w-full min-w-[300px] max-w-[460px]">
            <svg
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="overflow-visible w-full h-auto"
                style={{ filter: 'drop-shadow(0 20px 60px rgba(0,180,216,0.18)) drop-shadow(0 0 40px rgba(212,175,55,0.08))' }}>
                <defs>
                    <style>{`
            @keyframes radarPulse {
              from { transform: scale(1); opacity: 0.45; }
              to   { transform: scale(2.3); opacity: 0; }
            }
          `}</style>
                    <linearGradient id="israelFill" x1="0%" y1="0%" x2="40%" y2="100%">
                        <stop offset="0%" stopColor="#1d4068" />
                        <stop offset="60%" stopColor="#0d2a4a" />
                        <stop offset="100%" stopColor="#071624" />
                    </linearGradient>
                    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#00b4d8" />
                        <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                    <filter id="landShadow" x="-30%" y="-20%" width="180%" height="160%">
                        <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#00b4d8" floodOpacity="0.15" />
                        <feDropShadow dx="0" dy="0" stdDeviation="20" floodColor="#0a1628" floodOpacity="0.5" />
                    </filter>
                    <filter id="markerGlow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="strongGlow">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#00b4d8" />
                        <stop offset="100%" stopColor="#D4AF37" />
                    </radialGradient>
                </defs>

                {/* Israel shape fill */}
                <motion.path
                    d={ISRAEL_PATH_D}
                    fill="url(#israelFill)"
                    filter="url(#landShadow)"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ transformOrigin: `${WIDTH / 2}px ${HEIGHT / 2}px` }}
                />

                {/* Inner subtle texture dots */}
                {Array.from({ length: 30 }).map((_, i) => {
                    const x = 60 + (i % 6) * 50;
                    const y = 60 + Math.floor(i / 6) * 110;
                    return <circle key={i} cx={x} cy={y} r="0.9" fill="#D4AF37" opacity="0.1" />;
                })}

                {/* Animated gold + blue border */}
                <motion.path
                    d={ISRAEL_PATH_D}
                    fill="none"
                    stroke="url(#borderGrad)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.4 }}
                />

                {/* Connection lines between cities */}
                {cities.map((city, i) => {
                    if (i === cities.length - 1) return null;
                    const [x1, y1] = project(city.lng, city.lat);
                    const [x2, y2] = project(cities[i + 1].lng, cities[i + 1].lat);
                    return (
                        <motion.line key={`line-${i}`}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="url(#dotGrad)" strokeWidth="1" strokeDasharray="7,7"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 0.25 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.8 + i * 0.15, duration: 0.8 }}
                        />
                    );
                })}

                {/* City markers */}
                {cities.map((city, i) => {
                    const [cx, cy] = project(city.lng, city.lat);
                    const isActive = active === city.id;
                    const offset = LABEL_OFFSETS[city.id] || { x: 0, y: -48 };
                    const pillX = cx + offset.x - 55;
                    const pillY = cy + offset.y;
                    const textX = cx + offset.x;
                    const textY = cy + offset.y + 21;
                    return (
                        <g key={city.id}
                            onMouseEnter={() => setActive(city.id)}
                            onMouseLeave={() => setActive(null)}
                            style={{ cursor: 'pointer' }}>

                            {/* Radar rings — CSS animation */}
                            {[0, 0.65].map((delay, ri) => (
                                <circle key={ri} cx={cx} cy={cy} r={20}
                                    fill="none" stroke={city.color}
                                    strokeWidth={isActive ? 1.2 : 0.7}
                                    style={{
                                        transformBox: 'fill-box' as any,
                                        transformOrigin: 'center',
                                        animation: `radarPulse ${isActive ? 1.3 : 2.8}s ease-out ${delay + i * 0.12}s infinite`,
                                        pointerEvents: 'none'
                                    }}
                                />
                            ))}

                            {/* Glow halo */}
                            <circle cx={cx} cy={cy}
                                r={isActive ? 22 : 14}
                                fill={city.color}
                                opacity={isActive ? 0.2 : 0.07}
                                filter="url(#strongGlow)"
                                style={{ pointerEvents: 'none' }}
                            />

                            {/* Invisible Stable Hit Area */}
                            <circle cx={cx} cy={cy} r={25} fill="transparent" style={{ cursor: 'pointer' }} />

                            {/* Core dot */}
                            <motion.circle cx={cx} cy={cy}
                                r={isActive ? 12 : 8}
                                fill={isActive ? city.color : '#0d1b2a'}
                                stroke={city.color}
                                strokeWidth={isActive ? 3.5 : 2.5}
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.0 + i * 0.12, type: 'spring', stiffness: 300 }}
                                filter={isActive ? 'url(#markerGlow)' : 'none'}
                                style={{ pointerEvents: 'none' }}
                            />

                            {/* Inner white dot */}
                            <motion.circle cx={cx} cy={cy}
                                r={isActive ? 5 : 3}
                                fill="white"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.2 + i * 0.12, type: 'spring' }}
                                opacity={isActive ? 1 : 0.75}
                                style={{ pointerEvents: 'none' }}
                            />

                            {/* City label background pill */}
                            <motion.rect
                                x={pillX} y={pillY}
                                width={110} height={30}
                                rx={15}
                                fill={isActive ? city.color : 'rgba(10,22,40,0.8)'}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.5 + i * 0.1 }}
                                style={{ pointerEvents: 'none', transition: 'fill 0.25s ease' }}
                            />

                            {/* City label */}
                            <motion.text x={textX} y={textY} textAnchor="middle"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1.5 + i * 0.1 }}
                                style={{
                                    fontFamily: 'Heebo, sans-serif',
                                    fontSize: isActive ? 24 : 22,
                                    fontWeight: 900,
                                    fill: isActive ? '#0d1b2a' : 'rgba(255,255,255,0.92)',
                                    pointerEvents: 'none',
                                    transition: 'all 0.25s ease',
                                }}>
                                {city.name}
                            </motion.text>
                        </g>
                    );
                })}

                {/* Mediterranean label */}
                <text x="32" y={HEIGHT - 24}
                    style={{
                        fontFamily: 'Heebo, sans-serif',
                        fontSize: 14,
                        fontWeight: 700,
                        fill: 'rgba(0,180,216,0.3)',
                        letterSpacing: '0.15em'
                    }}>
                    ← ים תיכון
                </text>
            </svg>
        </motion.div>
    );
};

export default DesktopMapSvg;
