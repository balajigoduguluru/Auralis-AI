import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function canSendEmail(): boolean {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export async function sendFeedbackEmail(data: {
  message: string;
  location: string;
  timestamp: string;
}): Promise<boolean> {
  if (!canSendEmail()) return false;
  try {
    await emailjs.send(
      SERVICE_ID!,
      TEMPLATE_ID!,
      {
        to_email: 'balugoduguluri189@gmail.com',
        from_name: 'Auralis AI Observation Node',
        message: data.message,
        location: data.location,
        timestamp: data.timestamp,
      },
      PUBLIC_KEY!
    );
    return true;
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return false;
  }
}
