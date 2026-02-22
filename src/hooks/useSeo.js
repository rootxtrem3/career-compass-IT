import { useEffect } from 'react';

export function useSeo({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = title;
    }

    if (description) {
      const element = document.querySelector('meta[name="description"]');
      if (element) element.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description]);
}
