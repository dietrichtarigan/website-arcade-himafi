'use client';

import { useEffect } from 'react';

export default function NetlifyTokenRedirect() {
  useEffect(() => {
    // Handle Netlify CMS confirmation token redirect
    const hash = window.location.hash;
    
    if (hash.includes('confirmation_token') || hash.includes('recovery_token')) {
      console.log('Found Netlify token, redirecting to admin...');
      const newUrl = window.location.origin + '/admin/' + hash;
      window.location.replace(newUrl);
    }
  }, []);

  return null; // This component doesn't render anything
}
