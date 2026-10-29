import React, { useEffect, useRef, type PropsWithChildren } from "react";

interface InfiniteScrollTriggerProps extends PropsWithChildren {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: VoidFunction;
}

const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  children,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  /** Values */

  const ref = useRef<HTMLDivElement>(null);

  /** Effects */

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return hasNextPage ? <div ref={ref}>{children}</div> : null;
};

export default InfiniteScrollTrigger;
