export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.whatsapp-clone.local';

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  STICKER: 'sticker',
  LOCATION: 'location',
  CONTACT: 'contact',
  SYSTEM: 'system',
};

export const CALL_TYPES = {
  VOICE: 'voice',
  VIDEO: 'video',
};

export const CALL_DIRECTIONS = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  MISSED: 'missed',
};

export const STATUS_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
};

export const CHAT_TYPES = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
};

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
};
