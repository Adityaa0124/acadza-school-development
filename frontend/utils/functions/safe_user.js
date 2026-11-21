/*
 * THE FIELDS THAT MUST NOT BE CACHED.
 *
 * student-frontend strips these on the way into the cookie and into the persisted redux slice,
 * because the login response used to carry the account's readable password: a cookie is sent to
 * the server on EVERY request, so a password kept there travels with every call the site makes.
 *
 * This project's backend never returns `password`, so this is belt and braces rather than a
 * repair — but it is the same door every caller goes through, so it cannot be forgotten by
 * whoever adds the next field.
 */
export const safeUser = (user) => {
    if (!user || typeof user !== 'object') return user;
    const { password, ipList, ...rest } = user;
    return rest;
};
