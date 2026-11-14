import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export const generateAccessToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role.id,
        purpose: user.must_change_password ? 'password_change' : 'access'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
};

export const generateRefreshToken = (user) => {
    const payload = {
        id: user.id,
        purpose: 'refresh'
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
};

export const getRefreshTokenExpiration = (token) => {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === 'string' || typeof decoded.exp !== 'number')
        throw new Error('No se pudo determinar la expiración del refresh token');
    
    return new Date(decoded.exp * 1000);
};

export const hashRefreshToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};