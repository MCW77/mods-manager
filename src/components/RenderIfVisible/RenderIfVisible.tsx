// react
import React, { useState, useRef, useEffect } from 'react';


type Props = {
  defaultHeight?: number,
  visibleOffset?: number,
  root?: React.RefObject<HTMLElement> | null,
  children: React.ReactNode,
}

const isWindowAvailable = typeof window !== 'undefined';
const isRequestIdleCallbackAvailable = isWindowAvailable && 'requestIdleCallback' in window;


const RenderIfVisible = ({
  defaultHeight = 300,
  visibleOffset = 1000,
  root = null,
  children,
}: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(!isWindowAvailable)
  const placeholderHeight = useRef<number>(defaultHeight)
  const intersectionRef = useRef<HTMLDivElement>(null)

  const setVisibleOnIdle = (visible: boolean) => {
    if (isRequestIdleCallbackAvailable) {
      window.requestIdleCallback(
        () => setIsVisible(visible),
        {
          timeout: 600,
        }
      );
    } else {
      setIsVisible(visible);
    }
  }  
  // Set visibility with intersection observer
  useEffect(() => {
    if (intersectionRef.current === null) return () => {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibleOnIdle(entry.isIntersecting)
      },
      {
          root: root?.current ?? null,
          rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px`,
      },
    )
    observer.observe(intersectionRef.current)
    return () => {
      if (intersectionRef.current !== null) {
        observer.unobserve(intersectionRef.current)
      }
    }
  }, [intersectionRef])

  // Set true height for placeholder element after render.
  useEffect(() => {
    if (intersectionRef.current && isVisible) {
      placeholderHeight.current = intersectionRef.current.offsetHeight
    }
  }, [isVisible, intersectionRef])

  return (
    <div ref={intersectionRef}>
      {isVisible ? (
        <>{children}</>
      ) : (
        <div style={{ height: placeholderHeight.current }} />
      )}
    </div>
  )
}

export { RenderIfVisible };