import { useEffect, useRef } from "react";

export interface useInfiniteScrollProps {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  disabled?: boolean;
  onLoadMore: VoidFunction;
}

const useInfiniteScroll = ({
  root = null,
  rootMargin = "200px",
  threshold = 0,
  disabled = false,
  onLoadMore,
}: useInfiniteScrollProps) => {
  /** Values */

  const ref = useRef<HTMLDivElement>(null);

  /** Effects */

  useEffect(() => {
    const element = ref.current;

    if (!element || disabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [onLoadMore, disabled, root, rootMargin, threshold]);

  return ref;
};

export default useInfiniteScroll;
