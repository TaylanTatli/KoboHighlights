import { getLocaleFromString } from '@/utils/locales';
import { cookies, headers } from 'next/headers';

export const getCurrentLocale = () => {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get('kobohighlights-locale');

  const headersList = headers();
  const browserLocale = headersList.get('accept-language');

  return getLocaleFromString(cookieLocale?.value || browserLocale?.split(',')[0] || 'en-US');
};