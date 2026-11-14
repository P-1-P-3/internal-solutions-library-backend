import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors.js";
import {
    generateAccessToken,
    generateRefreshToken,
    getRefreshTokenExpiration,
    hashRefreshToken
} from "../utils/tokens.js";
import { clearCookies } from "../utils/cookies.js";
import { hashPassword } from "../utils/hash-password.js";

export class AuthService {
    constructor(userModel) {
        this.usersModel = userModel;
    };

    async login(email, password) {
        const user = await this.usersModel.getUserByEmail(email);
        if (!user)
            throw new CustomError(400, 'Credenciales incorrectas.');

        if (!user.is_active)
            throw new CustomError(400, 'Tu cuenta está inactiva. Contacta al administrador para obtener ayuda.');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new CustomError(400, 'Credenciales incorrectas.');

        const accessToken  = generateAccessToken(user);
        let refreshToken;
        if (!user.must_change_password) {
            refreshToken = generateRefreshToken(user);
    
            await this.usersModel.createRefreshToken({
                user_id: user.id,
                token_hash: hashRefreshToken(refreshToken),
                expires_date: getRefreshTokenExpiration(refreshToken)
            });
        }

        if (!user.must_change_password)
            await this.usersModel.updateLastLogin(user.id);

        return { accessToken, refreshToken, must_change_password: user.must_change_password };
    };

    async refreshToken(res, oldToken) {
        if (!oldToken) {
            clearCookies(res);
            throw new CustomError(401, 'Sesión no válida');
        }

        let decoded;
        try {
            decoded = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
                clearCookies(res);
                throw new CustomError(401, 'Sesión expirada o inválida');
            }
            throw new CustomError(400, 'Error interno del servidor');
        }

        if (!decoded || typeof decoded !== 'object' || decoded.purpose !== 'refresh' || !decoded.id) {
            clearCookies(res);
            throw new CustomError(401, 'Sesión expirada o inválida');
        }

        const refreshToken = generateRefreshToken({ id: decoded.id });
        const user = await this.usersModel.rotateRefreshToken(
            hashRefreshToken(oldToken),
            decoded.id,
            {
                token_hash:   hashRefreshToken(refreshToken),
                expires_date: getRefreshTokenExpiration(refreshToken)
            }
        );

        if (!user) {
            clearCookies(res);
            throw new CustomError(401, 'Sesión expirada o inválida');
        }

        const accessToken = generateAccessToken(user);
        return { accessToken, refreshToken, must_change_password: user.must_change_password };
    };

    async logout(refreshToken) {
        if (refreshToken)
            await this.usersModel.revokeRefreshToken(hashRefreshToken(refreshToken));
    };

    async passwordChange(id, password, userId) {
        const hashPass = await hashPassword(password);
        const res = await this.usersModel.updatePassword(id, hashPass, userId);
        await this.usersModel.revokeRefreshTokensForUser(id);
        return { update_password: res, message: 'Contraseña actualizada. Debes iniciar sesión nuevamente.' };
    };

    async me(id) {
        const user = await this.usersModel.getUser(id);
        if (!user) throw new CustomError(400, 'Usuario no encontrado');

        if (!user.is_active)
            throw new CustomError(400, 'La cuenta se encuentra desactivada');

        return { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
    };
};