import { api } from '@/api';
import router from '@/router';
import { getLocalToken, removeLocalToken, saveLocalToken } from '@/utils';
import { AxiosError } from 'axios';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
    commitAddNotification,
    commitRemoveNotification,
    commitSetLoggedIn,
    commitSetLogInError,
    commitSetToken,
    commitSetUserProfile,
    commitSetCryptobots,
    commitSetCryptobot,
    commitSetBinanceAccounts,
    commitSetBinanceAccount,
    commitSetTelegrams,
    commitSetTelegram,
    commitSetCryptobotStatus,
    commitSetCryptobotLogs,
    commitSetCryptobotVersion,
    commitSetMarginCurrencies,
    commitSetMarginCurrency,
    commitSetMarginBoardTrades,
} from './mutations';
import { AppNotification, MainState } from './state';

type MainContext = ActionContext<MainState, State>;

export const actions = {
    async actionLogIn(context: MainContext, payload: { username: string; password: string }) {
        try {
            const response = await api.logInGetToken(payload.username, payload.password);
            const token = response.data.access_token;
            if (token) {
                saveLocalToken(token);
                commitSetToken(context, token);
                commitSetLoggedIn(context, true);
                commitSetLogInError(context, false);
                await dispatchGetUserProfile(context);
                await dispatchRouteLoggedIn(context);
                commitAddNotification(context, { content: 'Logged in', color: 'success' });
            } else {
                await dispatchLogOut(context);
            }
        } catch (err) {
            commitSetLogInError(context, true);
            await dispatchLogOut(context);
        }
    },
    async actionGetUserProfile(context: MainContext) {
        try {
            const response = await api.getMe(context.state.token);
            if (response.data) {
                commitSetUserProfile(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionUpdateUserProfile(context: MainContext, payload) {
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.updateMe(context.state.token, payload),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitSetUserProfile(context, response.data);
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Profile successfully updated', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionCheckLoggedIn(context: MainContext) {
        if (!context.state.isLoggedIn) {
            let token = context.state.token;
            if (!token) {
                const localToken = getLocalToken();
                if (localToken) {
                    commitSetToken(context, localToken);
                    token = localToken;
                }
            }
            if (token) {
                try {
                    const response = await api.getMe(token);
                    commitSetLoggedIn(context, true);
                    commitSetUserProfile(context, response.data);
                } catch (error) {
                    await dispatchRemoveLogIn(context);
                }
            } else {
                await dispatchRemoveLogIn(context);
            }
        }
    },
    async actionRemoveLogIn(context: MainContext) {
        removeLocalToken();
        commitSetToken(context, '');
        commitSetLoggedIn(context, false);
    },
    async actionLogOut(context: MainContext) {
        await dispatchRemoveLogIn(context);
        await dispatchRouteLogOut(context);
    },
    async actionUserLogOut(context: MainContext) {
        await dispatchLogOut(context);
        commitAddNotification(context, { content: 'Logged out', color: 'success' });
    },
    actionRouteLogOut(context: MainContext) {
        if (router.currentRoute.path !== '/login') {
            router.push('/login');
        }
    },
    async actionCheckApiError(context: MainContext, payload: AxiosError) {
        if (payload.response!.status === 401) {
            await dispatchLogOut(context);
        }
    },
    actionRouteLoggedIn(context: MainContext) {
        if (router.currentRoute.path === '/login' || router.currentRoute.path === '/' || router.currentRoute.path === '/register') {
            router.push('/main');
        }
    },
    async removeNotification(context: MainContext, payload: { notification: AppNotification, timeout: number }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commitRemoveNotification(context, payload.notification);
                resolve(true);
            }, payload.timeout);
        });
    },
    async passwordRecovery(context: MainContext, payload: { username: string }) {
        const loadingNotification = { content: 'Sending password recovery email', showProgress: true };
        try {
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.passwordRecovery(payload.username),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Password recovery email sent', color: 'success' });
            await dispatchLogOut(context);
        } catch (error) {
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { color: 'error', content: 'Incorrect username' });
        }
    },
    async resetPassword(context: MainContext, payload: { password: string, token: string }) {
        const loadingNotification = { content: 'Resetting password', showProgress: true };
        try {
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.resetPassword(payload.password, payload.token),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Password successfully reset', color: 'success' });
            await dispatchLogOut(context);
        } catch (error) {
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { color: 'error', content: 'Error resetting password' });
        }
    },
    // Cryptobots
    async actionGetCryptobots(context: MainContext) {
        try {
            const response = await api.getCryptobots(context.state.token);
            if (response) {
                commitSetCryptobots(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionGetCryptobot(context: MainContext, cryptobotId: string) {
        try {
            const response = await api.getCryptobot(context.state.token, cryptobotId);
            if (response) {
                commitSetCryptobot(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionCreateCryptobot(context: MainContext, payload) {
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);

            const binanceAccountId = payload.binance_account_id;
            const telegramId = payload.telegram_id;
            delete payload.binance_account_id;
            delete payload.telegram_id;

            const response = (await Promise.all([
                api.createCryptobot(context.state.token, payload, binanceAccountId, telegramId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Cryptobot successfully added', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionUpdateCryptobot(context: MainContext, payload) {
        const cryptobotId = payload.id;
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);

            const response = (await Promise.all([
                api.updateCryptobot(context.state.token, payload, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Cryptobot successfully updated', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionRemoveCryptobot(context: MainContext, cryptobotId: string) {
        try {
            const loadingNotification = { content: 'deleting', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.removeCryptobot(context.state.token, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            // commitRemoveCryptobot(context, response.data);
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Cryptobot successfully deleted', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },

    // Cryptobot Info
    async actionGetCryptobotStatus(context: MainContext, payload) {
        try {
            const response = await api.getCryptobotStatus(context.state.token, payload);
            if (response) {
                commitSetCryptobotStatus(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionGetCryptobotLogs(context: MainContext, payload) {
        try {
            const response = await api.getCryptobotLogs(context.state.token, payload);
            if (response) {
                commitSetCryptobotLogs(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionGetCryptobotVersion(context: MainContext, payload) {
        try {
            const response = await api.getCryptobotVersion(context.state.token, payload);
            if (response) {
                commitSetCryptobotVersion(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },

    // Binance Accounts
    async actionGetBinanceAccounts(context: MainContext) {
        try {
            const response = await api.getBinanceAccounts(context.state.token);
            if (response) {
                commitSetBinanceAccounts(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionGetBinanceAccount(context: MainContext, cryptobotId: string) {
        try {
            const response = await api.getBinanceAccount(context.state.token, cryptobotId);
            if (response) {
                commitSetBinanceAccount(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionCreateBinanceAccount(context: MainContext, payload) {
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.createBinanceAccount(context.state.token, payload),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Binance account successfully added', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionUpdateBinanceAccount(context: MainContext, payload) {
        const cryptobotId = payload.id;
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.updateBinanceAccount(context.state.token, payload, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Binance account successfully updated', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionRemoveBinanceAccount(context: MainContext, cryptobotId: string) {
        try {
            const loadingNotification = { content: 'deleting', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.removeBinanceAccount(context.state.token, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            // commitRemoveBinanceAccount(context, response.data);
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Binance account successfully deleted', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    // Telegrams
    async actionGetTelegrams(context: MainContext) {
        try {
            const response = await api.getTelegrams(context.state.token);
            if (response) {
                commitSetTelegrams(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionGetTelegram(context: MainContext, cryptobotId: string) {
        try {
            const response = await api.getTelegram(context.state.token, cryptobotId);
            if (response) {
                commitSetTelegram(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionCreateTelegram(context: MainContext, payload) {
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.createTelegram(context.state.token, payload),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Telegram channel successfully added', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionUpdateTelegram(context: MainContext, payload) {
        const cryptobotId = payload.id;
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.updateTelegram(context.state.token, payload, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Telegram channel successfully updated', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionRemoveTelegram(context: MainContext, cryptobotId: string) {
        try {
            const loadingNotification = { content: 'deleting', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.removeTelegram(context.state.token, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            // commitRemoveTelegram(context, response.data);
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Telegram channel successfully deleted', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    // Margin currencies
    async actionGetMarginCurrencies(context: MainContext) {
        try {
            const response = await api.getMarginCurrencies(context.state.token);
            if (response) {
                commitSetMarginCurrencies(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionCreateMarginCurrency(context: MainContext, payload) {
        try {
            const loadingNotification = { content: 'saving', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.createMarginCurrency(context.state.token, payload),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Currency successfully added', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    // async actionUpdateMarginCurrency(context: MainContext, payload) {
    //     const cryptobotId = payload.id;
    //     try {
    //         const loadingNotification = { content: 'saving', showProgress: true };
    //         commitAddNotification(context, loadingNotification);
    //         const response = (await Promise.all([
    //             api.updateMarginCurrency(context.state.token, payload, cryptobotId),
    //             await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
    //         ]))[0];
    //         commitRemoveNotification(context, loadingNotification);
    //         commitAddNotification(context, { content: 'Currency successfully updated', color: 'success' });
    //     } catch (error) {
    //         await dispatchCheckApiError(context, error);
    //     }
    // },
    async actionRemoveMarginCurrency(context: MainContext, cryptobotId: string) {
        try {
            const loadingNotification = { content: 'deleting', showProgress: true };
            commitAddNotification(context, loadingNotification);
            const response = (await Promise.all([
                api.removeMarginCurrency(context.state.token, cryptobotId),
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
            ]))[0];
            // commitRemoveMarginCurrency(context, response.data);
            commitRemoveNotification(context, loadingNotification);
            commitAddNotification(context, { content: 'Currency successfully deleted', color: 'success' });
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },
    async actionsGetMarginBoardTrades(context: MainContext) {
        try {
            const response = await api.getMarginCurrenciesTrades(context.state.token);
            if (response) {
                commitSetMarginBoardTrades(context, response.data);
            }
        } catch (error) {
            await dispatchCheckApiError(context, error);
        }
    },

};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchCheckApiError = dispatch(actions.actionCheckApiError);
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn);
export const dispatchGetUserProfile = dispatch(actions.actionGetUserProfile);
export const dispatchLogIn = dispatch(actions.actionLogIn);
export const dispatchLogOut = dispatch(actions.actionLogOut);
export const dispatchUserLogOut = dispatch(actions.actionUserLogOut);
export const dispatchRemoveLogIn = dispatch(actions.actionRemoveLogIn);
export const dispatchRouteLoggedIn = dispatch(actions.actionRouteLoggedIn);
export const dispatchRouteLogOut = dispatch(actions.actionRouteLogOut);
export const dispatchUpdateUserProfile = dispatch(actions.actionUpdateUserProfile);
export const dispatchRemoveNotification = dispatch(actions.removeNotification);
export const dispatchPasswordRecovery = dispatch(actions.passwordRecovery);
export const dispatchResetPassword = dispatch(actions.resetPassword);

export const dispatchGetCryptobots = dispatch(actions.actionGetCryptobots);
export const dispatchGetCryptobot = dispatch(actions.actionGetCryptobot);
export const dispatchCreateCryptobot = dispatch(actions.actionCreateCryptobot);
export const dispatchUpdateCryptobot = dispatch(actions.actionUpdateCryptobot);
export const dispatchRemoveCryptobot = dispatch(actions.actionRemoveCryptobot);

export const dispatchGetCryptobotStatus = dispatch(actions.actionGetCryptobotStatus);
export const dispatchGetCryptobotLogs = dispatch(actions.actionGetCryptobotLogs);
export const dispatchGetCryptobotVersion = dispatch(actions.actionGetCryptobotVersion);

export const dispatchGetBinanceAccounts = dispatch(actions.actionGetBinanceAccounts);
export const dispatchGetBinanceAccount = dispatch(actions.actionGetBinanceAccount);
export const dispatchCreateBinanceAccount = dispatch(actions.actionCreateBinanceAccount);
export const dispatchUpdateBinanceAccount = dispatch(actions.actionUpdateBinanceAccount);
export const dispatchRemoveBinanceAccount = dispatch(actions.actionRemoveBinanceAccount);

export const dispatchGetTelegrams = dispatch(actions.actionGetTelegrams);
export const dispatchGetTelegram = dispatch(actions.actionGetTelegram);
export const dispatchCreateTelegram = dispatch(actions.actionCreateTelegram);
export const dispatchUpdateTelegram = dispatch(actions.actionUpdateTelegram);
export const dispatchRemoveTelegram = dispatch(actions.actionRemoveTelegram);

export const dispatchGetMarginCurrencies = dispatch(actions.actionGetMarginCurrencies);
export const dispatchCreateMarginCurrency = dispatch(actions.actionCreateMarginCurrency);
export const dispatchRemoveMarginCurrency = dispatch(actions.actionRemoveMarginCurrency);
export const dispatchGetMarginBoardTrades = dispatch(actions.actionsGetMarginBoardTrades);
