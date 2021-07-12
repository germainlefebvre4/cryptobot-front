import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { MainState } from './state';
import { ICryptobot } from '@/interfaces';


const defaultCryptobot: ICryptobot = {
  user_id: '',
  customer: '',
  binance_api_url: '',
  binance_api_key: '',
  binance_api_secret: '',
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
};

export const mainModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
