/*
 * One place the API base URL is read from, as in student-frontend. It is a build-time public
 * value, so changing it needs a restart of `next dev`.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
