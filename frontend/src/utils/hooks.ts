import { RefObject, useRef } from 'react';

export interface UseScrollHereProps {
  ref: React.RefObject<HTMLDivElement> | string;
  block?: 'start' | 'center' | 'end' | 'nearest';
}

export const useScrollHere = ({ ref, block }: UseScrollHereProps) => {
  const scrollHere = () => {
    if (typeof ref === 'string') {
      const element = document.getElementById(ref);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block });
      }
    }
    const refType = ref as RefObject<HTMLDivElement>;
    if (refType.current) {
      refType.current.scrollIntoView({ behavior: 'smooth', block});
    }
  }
  return scrollHere;
}