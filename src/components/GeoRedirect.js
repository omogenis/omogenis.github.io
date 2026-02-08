import { useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// List of ISO country codes for Russian language redirection
const RU_COUNTRIES = [
  'AZ', // Azerbaijan
  'AM', // Armenia
  'GE', // Georgia
  'EE', // Estonia
  'KZ', // Kazakhstan
  'KG', // Kyrgyzstan
  'LV', // Latvia
  'BY', // Belarus (Belarussia)
  'LT', // Lithuania
  'MD', // Moldova
  'UZ', // Uzbekistan
  'UA', // Ukraine
  'RU', // Russia
  'TJ', // Tajikistan
  'TM'  // Turkmenistan
];

export default function GeoRedirect() {
  const { i18n } = useDocusaurusContext();
  
  useEffect(() => {
    // 1. Check if we have already performed a check in this session.
    // This prevents the user from being trapped if they manually switch languages.
    if (sessionStorage.getItem('geo_checked')) {
      return;
    }

    const detectAndRedirect = async () => {
      try {
        // 2. Fetch user's country code
        const resp = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (!resp.ok) return;
        
        const data = await resp.json();
        const country = data.country; // Returns 2-letter ISO code (e.g., "GR", "RU")

        // 3. Determine target locale based on rules
        let targetLocale = 'en'; // Default to English (Else condition)
        
        if (country === 'GR') {
          targetLocale = 'el';
        } else if (RU_COUNTRIES.includes(country)) {
          targetLocale = 'ru';
        }

        const currentLocale = i18n.currentLocale;

        // 4. Redirect if current locale does not match target
        if (currentLocale !== targetLocale) {
          const pathname = window.location.pathname;
          let newPath = pathname;

          // Strip current locale prefix (if not default 'ru')
          // Example: /el/docs -> /docs
          if (currentLocale !== 'ru') {
             newPath = newPath.replace(new RegExp(`^/${currentLocale}`), '') || '/';
          }

          // Add target locale prefix (if not default 'ru')
          // Example: /docs -> /en/docs
          if (targetLocale !== 'ru') {
             // Handle root specially to avoid //
             if (newPath === '/') {
                 newPath = `/${targetLocale}/`;
             } else {
                 newPath = `/${targetLocale}${newPath}`;
             }
          }
          
          // Mark as checked immediately
          sessionStorage.setItem('geo_checked', 'true');
          
          // Perform redirect
          window.location.replace(newPath);
        } else {
          // If we are already on the correct locale, mark as checked
          sessionStorage.setItem('geo_checked', 'true');
        }
      } catch (e) {
        // Silently fail on error (e.g., ad blockers) and don't retry this session
        console.error('Geo detect error:', e);
        sessionStorage.setItem('geo_checked', 'true'); 
      }
    };

    detectAndRedirect();
  }, [i18n.currentLocale]);

  return null; // This component renders nothing
}