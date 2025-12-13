import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type RevealProps = {
  children: ReactNode;
  delayMs?: number;
  className?: string;
};

export function Reveal({ children, delayMs = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const style = useMemo(() => {
    return delayMs ? ({ transitionDelay: `${delayMs}ms` } as const) : undefined;
  }, [delayMs]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={
        `transition-all duration-700 will-change-transform motion-reduce:transition-none ` +
        (visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 motion-reduce:opacity-100 motion-reduce:translate-y-0') +
        ` ${className}`
      }
    >
      {children}
    </div>
  );
}
