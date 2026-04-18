const api = "https://v2.api.noroff.dev/holidaze/"

export const venues = `${api}venues/`;
export const profile = `${api}profiles/`;
export const register = `${api}auth/register`;
export const login = `${api}auth/login`;
export const bookings = `${api}bookings/`;

// ?_customer=true?_venue=true/

export const URLS_REQ_AUTH = [profile, bookings];