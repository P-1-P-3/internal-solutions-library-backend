const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie('access_token', accessToken, {
        ...baseCookieOptions,
        maxAge: 10 * 60 * 1000
    });

    if (refreshToken) {
        res.cookie('refresh_token', refreshToken, {
            ...baseCookieOptions,
            maxAge: 60 * 60 * 1000,
            path: '/api/auth'
        });
    }
};

export const clearCookies = (res) => {
    res.clearCookie('access_token', { ...baseCookieOptions });

    res.clearCookie('refresh_token', {
        ...baseCookieOptions,
        path: '/api/auth'
    });
};