import { getCurrentLocale } from '@/utils/getCurrentLocale';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = getCurrentLocale();

  const messages = (await import(`../../../locales/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});