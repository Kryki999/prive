export const CLINIC_PHONE = '+48 511 671 630';

export const CLINIC_PHONE_HREF = `tel:${CLINIC_PHONE.replace(/\s/g, '')}`;

export const CLINIC_ADDRESS_STREET = 'Piecewska 29 U20';
export const CLINIC_ADDRESS_CITY = '80-288 Gdańsk';
export const CLINIC_ADDRESS_FULL = `${CLINIC_ADDRESS_STREET}, ${CLINIC_ADDRESS_CITY}`;

const CLINIC_MAP_QUERY = encodeURIComponent(CLINIC_ADDRESS_FULL);

export const CLINIC_MAP_EMBED_URL = `https://maps.google.com/maps?q=${CLINIC_MAP_QUERY}&hl=pl&z=16&output=embed`;

export const CLINIC_MAP_DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${CLINIC_MAP_QUERY}`;