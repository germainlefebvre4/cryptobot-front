import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { MainState } from './state';
import { ICryptobot, IBinanceAccount, ITelegram } from '@/interfaces';


const defaultBinanceAccount: IBinanceAccount = {
  id: '',
  binance_api_url: '',
  binance_api_key: '',
  binance_api_secret: '',
};

const defaultTelegram: ITelegram = {
  id: '',
  client_id: '',
  token: '',
};

const defaultCryptobot: ICryptobot = {
  id: '',
  user_id: '',
  binance_account_id: 0,
  telegram_id: 0,
  binance_config_base_currency: '',
  binance_config_quote_currency: '',
  binance_config_granularity: '',
  binance_config_live: false,
  binance_config_verbose : true,
  binance_config_graphs: false,
  binance_config_buymaxsize: 1,
  binance_config_sellupperpcnt: 5,
  binance_config_selllowerpcnt: -5,
  logger_filelog: false,
  logger_logfile: '',
  logger_fileloglevel: '',
  logger_consolelog: true,
  logger_consoleloglevel: '',
  telegram_client_id: '',
  telegram_token: '',
};

const defaultState: MainState = {
  isLoggedIn: null,
  token: '',
  logInError: false,
  userProfile: null,
  dashboardMiniDrawer: false,
  dashboardShowDrawer: true,
  notifications: [],
  cryptobots: [],
  cryptobot: defaultCryptobot,
  binanceAccounts: [],
  binanceAccount: defaultBinanceAccount,
  telegrams: [],
  telegram: defaultTelegram,
};

export const mainModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
