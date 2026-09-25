import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const NOTIFICATION_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID;
const AUTO_REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

let initialized = false;

function initEmailJS(): void {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
}

export function canSendEmail(): boolean {
  return !!(SERVICE_ID && NOTIFICATION_TEMPLATE_ID && PUBLIC_KEY);
}

export async function sendAdminNotification(data: {
  message: string;
  userEmail: string;
  location: string;
  timestamp: string;
}): Promise<boolean> {
  if (!canSendEmail()) return false;
  initEmailJS();
  try {
    const response = await emailjs.send(
      SERVICE_ID!,
      NOTIFICATION_TEMPLATE_ID!,
      {
        to_email: 'balugoduguluri189@gmail.com',
        from_name: 'Auralis AI Observation Node',
        user_email: data.userEmail,
        message: data.message,
        location: data.location,
        timestamp: data.timestamp,
      },
    );
    console.log('[EmailJS] Admin notification sent:', response.status, response.text);
    return true;
  } catch (error: unknown) {
    const err = error as { status?: number; text?: string; message?: string };
    console.error('[EmailJS] Admin notification failed:', {
      status: err.status,
      text: err.text,
      message: err.message,
      error,
    });
    return false;
  }
}

export async function sendAutoReply(data: {
  to_email: string;
  message: string;
  location: string;
}): Promise<boolean> {
  if (!(SERVICE_ID && AUTO_REPLY_TEMPLATE_ID && PUBLIC_KEY)) return false;
  initEmailJS();
  try {
    const response = await emailjs.send(
      SERVICE_ID!,
      AUTO_REPLY_TEMPLATE_ID!,
      {
        to_email: data.to_email,
        from_name: 'Auralis AI',
        message: data.message,
        location: data.location,
        reply_message: `Hi,

Thank you for taking the time to share your feedback with **Auralis AI**.

We've successfully received your message and truly appreciate your input. Every observation, suggestion, and bug report helps us build a more transparent, explainable, and reliable climate intelligence platform.

Our team will review your submission as soon as possible. If your feedback requires a response or additional information, we'll get back to you.

In the meantime, feel free to continue exploring the project and share any additional ideas that could help improve Auralis AI.

Thank you for being part of our journey toward making climate intelligence more accessible and understandable.

Best regards,

**Balaji**
Developer, Auralis AI`,
      },
    );
    console.log('[EmailJS] Auto-reply sent:', response.status, response.text);
    return true;
  } catch (error: unknown) {
    const err = error as { status?: number; text?: string; message?: string };
    console.error('[EmailJS] Auto-reply failed:', {
      status: err.status,
      text: err.text,
      message: err.message,
      error,
    });
    return false;
  }
}
