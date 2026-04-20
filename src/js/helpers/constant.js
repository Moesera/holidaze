const api = "https://v2.api.noroff.dev/";
const endpoint = "holidaze/";

export const venues = `${api}${endpoint}venues/`;
export const profile = `${api}${endpoint}profiles/`;
export const register = `${api}auth/register`;
export const login = `${api}auth/login`;
export const bookings = `${api}${endpoint}bookings/`;

// ?_customer=true?_venue=true/

export const URLS_REQ_AUTH = [profile, bookings];