import enMessages from '../lang/en.json';
import thMessages from '../lang/th.json';

const messages = {
  en: enMessages,
  th: thMessages,
};

export function getMessages(locale: string) {
  return messages[locale as keyof typeof messages] || messages.th;
}


