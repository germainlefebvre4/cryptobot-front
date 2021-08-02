import { MainState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
    hasAdminAccess: (state: MainState) => {
        return (
            state.userProfile &&
            state.userProfile.is_superuser && state.userProfile.is_active);
    },
    loginError: (state: MainState) => state.logInError,
    dashboardShowDrawer: (state: MainState) => state.dashboardShowDrawer,
    dashboardMiniDrawer: (state: MainState) => state.dashboardMiniDrawer,
    userProfile: (state: MainState) => state.userProfile,
    token: (state: MainState) => state.token,
    isLoggedIn: (state: MainState) => state.isLoggedIn,
    firstNotification: (state: MainState) => state.notifications.length > 0 && state.notifications[0],
    cryptobots: (state: MainState) => state.cryptobots,
    cryptobot: (state: MainState) => state.cryptobot,
    binanceAccounts: (state: MainState) => state.binanceAccounts,
    binanceAccount: (state: MainState) => state.binanceAccount,
    telegrams: (state: MainState) => state.telegrams,
    telegram: (state: MainState) => state.telegram,
};

const {read} = getStoreAccessors<MainState, State>('');

export const readDashboardMiniDrawer = read(getters.dashboardMiniDrawer);
export const readDashboardShowDrawer = read(getters.dashboardShowDrawer);
export const readHasAdminAccess = read(getters.hasAdminAccess);
export const readIsLoggedIn = read(getters.isLoggedIn);
export const readLoginError = read(getters.loginError);
export const readToken = read(getters.token);
export const readUserProfile = read(getters.userProfile);
export const readFirstNotification = read(getters.firstNotification);
export const readCryptobots = read(getters.cryptobots);
export const readCryptobot = read(getters.cryptobot);
export const readBinanceAccounts = read(getters.binanceAccounts);
export const readBinanceAccount = read(getters.binanceAccount);
export const readTelegrams = read(getters.telegrams);
export const readTelegram = read(getters.telegram);
