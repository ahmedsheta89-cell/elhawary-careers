import { useEffect, useState } from 'react';
import {
  defaultSiteContent,
  getPublicSiteContent,
  type SiteContent,
} from '@/services/siteContentService';

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getPublicSiteContent().then((nextContent) => {
      if (active) {
        setContent(nextContent);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return { content, isLoading };
}
