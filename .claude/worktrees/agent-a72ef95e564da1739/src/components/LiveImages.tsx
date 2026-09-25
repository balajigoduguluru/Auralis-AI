import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageOff, Activity } from 'lucide-react';

interface LiveImagesProps {
  locationName: string;
}

const fallbackImage = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800';

function extractCity(name: string): string {
  return name.split(',')[0].trim();
}

export default function LiveImages({ locationName }: LiveImagesProps) {
  const [image, setImage] = useState<{ src: string; title: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const city = extractCity(locationName);
    if (!city) return;

    setLoading(true);

    async function fetchImage() {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`
        );
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.thumbnail?.source) {
            setImage({ src: data.thumbnail.source, title: data.title || city });
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to loremflickr
      }

      if (!cancelled) {
        setImage({
          src: `https://loremflickr.com/800/600/${city},landscape,nature`,
          title: city,
        });
        setLoading(false);
      }
    }

    fetchImage();
    return () => { cancelled = true; };
  }, [locationName]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-[2.5rem] border border-border/50 bg-surface/50">
        <Activity className="w-8 h-8 text-text-muted/40 animate-pulse" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        key={locationName}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full rounded-[2.5rem] overflow-hidden border border-border/50 relative group shadow-2xl bg-surface"
      >
        {image ? (
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = fallbackImage;
              } else {
                target.style.display = 'none';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <ImageOff className="w-10 h-10 text-text-muted/60" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-accent/80 via-transparent to-transparent opacity-50" aria-hidden="true" />
        {image && (
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-2xl max-w-sm">
              <div className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">
                {image.title}
              </div>
              <div className="text-[8px] text-white/60 font-bold uppercase tracking-widest mt-1">
                Multi-Spectral Capture
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
