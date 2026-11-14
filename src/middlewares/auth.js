import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors.js";

export const auth = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token)
        throw new CustomError(403, 'Acceso no autorizado');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.purpose !== (req.authPurpose ?? 'access'))
            throw new Error('Token no válido');

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            purpose: decoded.purpose
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new CustomError(401, 'El token de acceso ha caducado');
        } else {
            throw new CustomError(401, 'Token no válido');
        }
    }
};

export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return next(new CustomError(403, 'No tienes permisos para realizar esta acción'));
        }

        next();
    };
};

export const purposeMidd = (req, res, next) => {
    req.authPurpose = 'password_change';
    next();
};