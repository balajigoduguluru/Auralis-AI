import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageOff, Activity } from 'lucide-react';

interface LiveImagesProps {
  locationName: string;
}

interface WikiImage {
  src: string;
  title: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
  'https://images.unsplash.com/photo-1518173946687-a36f968f7f9f?w=800',
  'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800',
];

function extractCity(name: string): string {
  return name.split(',')[0].trim();
}

function getImageId(index: number, city: string): string {
  const seeds = ['landscape,nature', 'city,urban', 'architecture,skyline', 'satellite,aerial'];
  return `${city.toLowerCase().replace(/\s+/g, '')}-${seeds[index]}-${index}`;
}

export default function LiveImages({ locationName }: LiveImagesProps) {
  const [images, setImages] = useState<WikiImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const city = extractCity(locationName);
    if (!city) return;

    setLoading(true);

    async function fetchImages() {
      const results: WikiImage[] = [];

      // Try Wikipedia API for a single main image
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`
        );
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.thumbnail?.source) {
            results.push({
              src: data.thumbnail.source,
              title: data.title || city,
            });
          }
        }
      } catch {
        // fall back to defaults
      }

      // Try Wikimedia Commons for additional images
      try {
        const res = await fetch(
          `https://commons.wikimedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(city)}&gimlimit=6&prop=imageinfo&iiprop=url&format=json&origin=*`
        );
        if (!cancelled && res.ok) {
          const data = await res.json();
          const pages = data.query?.pages;
          if (pages) {
            Object.values(pages as Record<string, any>).forEach((page: any) => {
              if (page.imageinfo?.[0]?.url && results.length < 4) {
                const url = page.imageinfo[0].url;
                if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                  results.push({ src: url, title: page.title.replace('File:', '').replace(/_/g, ' ') });
                }
              }
            });
          }
        }
      } catch {
        // fall back to defaults
      }

      if (!cancelled) {
        // Fill remaining slots with loremflickr seeded images
        while (results.length < 4) {
          results.push({
            src: `https://loremflickr.com/800/800/${getImageId(results.length, city)}`,
            title: `${city} ${['Landscape', 'Urban', 'Architecture', 'Aerial'][results.length]}`,
          });
        }
        setImages(results.slice(0, 4));
        setLoading(false);
      }
    }

    fetchImages();

    return () => { cancelled = true; };
  }, [locationName]);

  if (loading) {
    return (
      <div className="md:col-span-2 grid grid-cols-2 gap-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${i === 0 ? 'md:col-span-2 col-span-2' : ''} aspect-square rounded-[2rem] overflow-hidden border border-border/20 bg-surface/50 flex items-center justify-center`}>
            <Activity className="w-8 h-8 text-text-muted/20 animate-pulse" aria-hidden="true" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-8">
      {images.map((img, i) => (
        <motion.div
          key={`${locationName}-${i}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className={`${i === 0 ? 'md:col-span-2 col-span-2' : ''} aspect-square rounded-[2rem] overflow-hidden border border-border/20 relative group shadow-xl bg-surface`}
        >
          <img
            src={img.src}
            alt={img.title}
            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = fallbackImages[i % fallbackImages.length];
              } else {
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <span className="text-[9px] font-black text-white uppercase tracking-widest block drop-shadow-lg">{img.title}</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center hidden pointer-events-none" aria-hidden="true">
            <ImageOff className="w-8 h-8 text-white/40" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
