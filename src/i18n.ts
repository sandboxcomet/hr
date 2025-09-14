import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
const locales = ['en', 'th'];
 
export default getRequestConfig(async ({locale}) => {
  // Ensure we have a valid locale
  const validLocale = locale && locales.includes(locale) ? locale : 'th';
  
  return {
    locale: validLocale,
    messages: (await import(`../lang/${validLocale}.json`)).default
  };
});
