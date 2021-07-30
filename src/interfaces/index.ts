export interface IUserProfile {
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    firstname: string;
    id: string;
    avatar?: string;
}

export interface IUserProfileUpdate {
    email?: string;
    firstname?: string;
    password?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}

export interface IUserProfileCreate {
    email: string;
    firstname?: string;
    password?: string;
    is_active?: boolean;
    is_superuser?: boolean;
}

export interface ICryptobotCreate {
    binance_account_id: number;
    binance_config_base_currency: string;
    binance_config_quote_currency: string;
    binance_config_granularity: string;
    binance_config_live: boolean;
    binance_config_verbose: boolean;
    binance_config_graphs: boolean;
    binance_config_buymaxsize: number;
    binance_config_sellupperpcnt: number;
    binance_config_selllowerpcnt: number;
    logger_filelog: boolean;
    logger_logfile: string;
    logger_fileloglevel: string;
    logger_consolelog: boolean;
    logger_consoleloglevel: string;
    telegram_client_id: string;
    telegram_token: string;
}

export interface ICryptobotUpdate {
    id?: string;
    binance_account_id: number;
    binance_config_base_currency: string;
    binance_config_quote_currency: string;
    binance_config_granularity: string;
    binance_config_live: boolean;
    binance_config_verbose: boolean;
    binance_config_graphs: boolean;
    binance_config_buymaxsize: number;
    binance_config_sellupperpcnt: number;
    binance_config_selllowerpcnt: number;
    logger_filelog: boolean;
    logger_logfile: string;
    logger_fileloglevel: string;
    logger_consolelog: boolean;
    logger_consoleloglevel: string;
    telegram_client_id: string;
    telegram_token: string;
}

export interface ICryptobot {
    id?: string;
    user_id?: string;
    binance_account_id: number;
    binance_config_base_currency: string;
    binance_config_quote_currency: string;
    binance_config_granularity: string;
    binance_config_live: boolean;
    binance_config_verbose: boolean;
    binance_config_graphs: boolean;
    binance_config_buymaxsize: number;
    binance_config_sellupperpcnt: number;
    binance_config_selllowerpcnt: number;
    logger_filelog: boolean;
    logger_logfile: string;
    logger_fileloglevel: string;
    logger_consolelog: boolean;
    logger_consoleloglevel: string;
    telegram_client_id: string;
    telegram_token: string;
}

export interface IBinanceAccountCreate {
    binance_api_key: string;
    binance_api_secret: string;
}

export interface IBinanceAccountUpdate {
    id?: string;
    binance_api_key: string;
    binance_api_secret: string;
}

export interface IBinanceAccount {
    id?: string;
    binance_api_url: string;
    binance_api_key: string;
    binance_api_secret: string;
}
