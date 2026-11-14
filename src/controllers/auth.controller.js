import { AuthService } from "../services/auth.service.js";
import { clearCookies, setAuthCookies } from "../utils/cookies.js";
import { resSuccess } from "../utils/res-success.js";

export class AuthController {
    constructor(usersModel) {
        this.authService = new AuthService(usersModel);
    };

    login = async (req, res) => {
        const { email, password } = req.body;
        
        const { accessToken, refreshToken, must_change_password } = await this.authService.login(email, password);

        setAuthCookies(res, accessToken, refreshToken);

        resSuccess(res, { must_change_password });
    };

    logout = async (req, res) => {
        await this.authService.logout(req.cookies.refresh_token);
        clearCookies(res);
        resSuccess(res, { message: 'Sessión cerrada' });
    };

    refresh = async (req, res) => {
        const oldToken = req.cookies.refresh_token;

        const { accessToken, refreshToken, must_change_password } = await this.authService.refreshToken(res, oldToken);

        setAuthCookies(res, accessToken, refreshToken);
        resSuccess(res, { must_change_password });
    };

    passwordChange = async (req, res) => {
        const { id }         = req.user;
        const { password }   = req.body;
        const { id: userId } = req.user;

        const passwordChanged = await this.authService.passwordChange(id, password, userId);

        clearCookies(res);

        resSuccess(res, passwordChanged);
    };

    me = async (req, res) => {
        const userID = req.user.id;

        const user = await this.authService.me(userID);

        resSuccess(res, user);
    };
};