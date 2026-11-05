import type { ShippingZone } from '../lib/types';

/**
 * ONE FILE FOR ALL SHOP SETTINGS.
 * Empty values stay hidden on the site. Nothing here is invented:
 * fill a value when the real information exists.
 */
export const site = {
  name: 'MochiPaw',
  tagline: 'Little Paws, Big Happiness.',

  /** true = the site shows "aperçu" labels and sends no order. */
  demoMode: true,

  contact: {
    /** International format without + or spaces, example 2126XXXXXXXX. Empty = checkout stays in demo. */
    whatsapp: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    hours: '',
  },

  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },

  /** Delivery prices per zone. Empty = the site says delivery is confirmed on WhatsApp. */
  shippingZones: [] as ShippingZone[],

  /** Example: 300 means free delivery from 300 DH. null = never mentioned on the site. */
  freeShippingFrom: null as number | null,

  payment: {
    cashOnDelivery: true,
    /** Add a provider only when it is really connected. */
    online: [] as string[],
  },

  newsletter: {
    /** Form address of the email tool, when one is chosen. Empty = the form shows a demo message. */
    endpoint: '',
  },
};

export const hasWhatsApp = () => site.contact.whatsapp.trim().length > 0;

/** Orders go out only when demo mode is off and a real number exists. */
export const checkoutIsLive = () => !site.demoMode && hasWhatsApp();
