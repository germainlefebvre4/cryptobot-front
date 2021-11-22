import {
    IUserProfile,
    ICryptobot,
    IBinanceAccount,
    ITelegram,
    ICryptobotMarginTradesCurrentLast,
    ICurrency,
    IMargin,
} from '@/interfaces';
import { MainState, AppNotification } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';


export const mutations = {
    setToken(state: MainState, payload: string) {
        state.token = payload;
    },
    setLoggedIn(state: MainState, payload: boolean) {
        state.isLoggedIn = payload;
    },
    setLogInError(state: MainState, payload: boolean) {
        state.logInError = payload;
    },
    setUserProfile(state: MainState, payload: IUserProfile) {
        state.userProfile = payload;
    },
    setDashboardMiniDrawer(state: MainState, payload: boolean) {
        state.dashboardMiniDrawer = payload;
    },
    setDashboardShowDrawer(state: MainState, payload: boolean) {
        state.dashboardShowDrawer = payload;
    },
    addNotification(state: MainState, payload: AppNotification) {
        state.notifications.push(payload);
    },
    removeNotification(state: MainState, payload: AppNotification) {
        state.notifications = state.notifications.filter((notification) => notification !== payload);
    },
    // Cryptobot
    setCryptobots(state: MainState, payload: ICryptobot[]) {
        state.cryptobots = payload;
    },
    setCryptobot(state: MainState, payload: ICryptobot) {
        state.cryptobot = payload;
    },
    // Cryptobot Info
    setCryptobotStatus(state: MainState, payload: string) {
        state.cryptobotStatus = payload;
    },
    setCryptobotLogs(state: MainState, payload: string) {
        state.cryptobotLogs = payload;
    },
    setCryptobotVersion(state: MainState, payload: string) {
        state.cryptobotVersion = payload;
    },
    // Cryptobot Margin
    setCryptobotMarginTradesCurrentLast(state: MainState, payload: ICryptobotMarginTradesCurrentLast) {
        state.cryptobotMarginTradesCurrentLast = payload;
    },
    setCryptobotMarginTradesCurrentRun(state: MainState, payload: ICryptobotMarginTradesCurrentLast) {
        state.cryptobotMarginTradesCurrentRun = payload;
    },
    // Binance Accounts
    setBinanceAccounts(state: MainState, payload: IBinanceAccount[]) {
        state.binanceAccounts = payload;
    },
    setBinanceAccount(state: MainState, payload: IBinanceAccount) {
        state.binanceAccount = payload;
    },
    // Telegrams
    setTelegrams(state: MainState, payload: ITelegram[]) {
        state.telegrams = payload;
    },
    setTelegram(state: MainState, payload: ITelegram) {
        state.telegram = payload;
    },
    // Margin currencies
    setMarginCurrencies(state: MainState, payload: ICurrency[]) {
        state.marginCurrencies = payload;
    },
    setMarginCurrency(state: MainState, payload: ICurrency) {
        state.marginCurrency = payload;
    },
    setMarginBoardTrades(state: MainState, payload: IMargin[]) {
        state.marginBoardTrades = payload;
    },
};

const {commit} = getStoreAccessors<MainState | any, State>('');

export const commitSetDashboardMiniDrawer = commit(mutations.setDashboardMiniDrawer);
export const commitSetDashboardShowDrawer = commit(mutations.setDashboardShowDrawer);
export const commitSetLoggedIn = commit(mutations.setLoggedIn);
export const commitSetLogInError = commit(mutations.setLogInError);
export const commitSetToken = commit(mutations.setToken);
export const commitSetUserProfile = commit(mutations.setUserProfile);
export const commitAddNotification = commit(mutations.addNotification);
export const commitRemoveNotification = commit(mutations.removeNotification);

export const commitSetCryptobots = commit(mutations.setCryptobots);
export const commitSetCryptobot = commit(mutations.setCryptobot);

export const commitSetCryptobotStatus = commit(mutations.setCryptobotStatus);
export const commitSetCryptobotLogs = commit(mutations.setCryptobotLogs);
export const commitSetCryptobotVersion = commit(mutations.setCryptobotVersion);

export const commitSetCryptobotMarginTradesCurrentLast = commit(mutations.setCryptobotMarginTradesCurrentLast);
export const commitSetCryptobotMarginTradesCurrentRun = commit(mutations.setCryptobotMarginTradesCurrentRun);

export const commitSetBinanceAccounts = commit(mutations.setBinanceAccounts);
export const commitSetBinanceAccount = commit(mutations.setBinanceAccount);

export const commitSetTelegrams = commit(mutations.setTelegrams);
export const commitSetTelegram = commit(mutations.setTelegram);

export const commitSetMarginCurrencies = commit(mutations.setMarginCurrencies);
export const commitSetMarginCurrency = commit(mutations.setMarginCurrency);
export const commitSetMarginBoardTrades = commit(mutations.setMarginBoardTrades);

