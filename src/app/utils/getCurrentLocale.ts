import { getLocaleFromString } from '@/utils/locales';
import { cookies, headers } from 'next/headers';

export const getCurrentLocale = async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('kobohighlights-locale');

  const headersList = await headers();
  const browserLocale = headersList.get('accept-language');

  return getLocaleFromString(cookieLocale?.value || browserLocale?.split(',')[0] || 'en-US');
};