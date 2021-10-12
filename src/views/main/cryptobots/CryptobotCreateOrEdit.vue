<template>
  <v-container ma-0 pa-0>
    <v-card>
      <v-card-title primary-title>
        <div class="headline primary--text">{{ title }}</div>
      </v-card-title>
      <v-card-text>
        <template>

          <v-form v-model="valid" ref="form" lazy-validation>

            <v-container>
              <v-row>
                <v-layout wrap fill-height>
                  <v-flex grow>
                    <v-switch
                      v-model="binanceConfigLive"
                      inset
                      :label="binanceConfigLiveLabel(binanceConfigLive)"
                    ></v-switch>
                  </v-flex>
                </v-layout>
              </v-row>
            </v-container>

            <v-container>
              <v-row>
                <v-subheader>Currency</v-subheader>
              </v-row>
              <v-row>
                <v-layout wrap fill-height>
                  <v-flex grow>
                    <v-text-field
                      label="Base currency"
                      v-model="binanceConfigBaseCurrency"
                      :rules="validateConfigBaseCurrency"
                    />
                  </v-flex>
                  <v-flex grow>
                  </v-flex>
                  <v-flex grow>
                    <v-text-field
                      label="Quote currency"
                      v-model="binanceConfigQuoteCurrency"
                      :rules="validateConfigQuoteCurrency"
                    />
                  </v-flex>
                </v-layout>
              </v-row>
            </v-container>

        <v-tabs vertical>
          <v-tab>
            <v-icon left>
              mdi-access-point
            </v-icon>
            Basic config
          </v-tab>
          <v-tab>
            <v-icon left>
              mdi-access-point
            </v-icon>
            Advanced config
          </v-tab>

          <v-tab-item>
            <v-container>
              <v-row>
                <v-layout wrap fill-height>
                  <v-flex grow>
                    <v-text-field
                      label="Buy max size"
                      v-model="binanceConfigBuymaxsize"
                      type="number"
                      :rules="validateConfigBuymaxsize"
                    />
                  </v-flex>
                  <v-flex grow>
                  </v-flex>
                  <v-flex grow>
                    <v-text-field
                      label="Granularity"
                      v-model="binanceConfigGranularity"
                      :rules="validateConfigGranularity"
                    />
                  </v-flex>
                </v-layout>
              </v-row>
              <v-row>
                <v-layout wrap fill-height>
                  <v-flex grow>
                    <v-text-field
                      label="Sell upper percent"
                      v-model="binanceConfigSellupperpcnt"
                      :rules="validateConfigSellupperpcnt"
                    />
                  </v-flex>
                  <v-flex grow>
                  </v-flex>
                  <v-flex grow>
                    <v-text-field
                      label="Sell lower percent"
                      v-model="binanceConfigSelllowerpcnt"
                      type="number"
                      :rules="validateConfigSelllowerpcnt"
                    />
                  </v-flex>
                </v-layout>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container>
              <v-row>
                <v-subheader>Advanced config</v-subheader>
              </v-row>
              <v-row>
                <v-layout wrap fill-height>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable bull only"
                      v-model="binanceConfigDisablebullonly"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable buy near high"
                      v-model="binanceConfigDisablebuynearhigh"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable buy MACD"
                      v-model="binanceConfigDisablebuymacd"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable buy EMA"
                      v-model="binanceConfigDisablebuyema"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable buy OBV"
                      v-model="binanceConfigDisablebuyobv"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable buy Elderray"
                      v-model="binanceConfigDisablebuyelderray"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable fail safe Fibanacci low"
                      v-model="binanceConfigDisablefailsafefibonaccilow"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable fail safe lower percent"
                      v-model="binanceConfigDisablefailsafelowerpcnt"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable profit bank upper percent"
                      v-model="binanceConfigDisableprofitbankupperpcnt"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable profit bank Fibonacci high"
                      v-model="binanceConfigDisableprofitbankfibonaccihigh"
                      inset
                    />
                  </v-flex>
                  <v-flex grow ps-1>
                    <v-switch
                      label="Disable profit bank reversal"
                      v-model="binanceConfigDisableprofitbankreversal"
                      inset
                    />
                  </v-flex>
                </v-layout>
              </v-row>
            </v-container>
          </v-tab-item>
        </v-tabs>

            <v-container>
              <v-row>
                <v-subheader>Binance</v-subheader>
              </v-row>
              <v-row>
                <v-select
                  v-model="binanceAccountId"
                  :items="binanceAccounts"
                  item-text="binance_api_key"
                  item-value="id"
                  label="Binance account"
                  :rules="[v => v || 'Please select a Binance account']"
                  required
                ></v-select>
              </v-row>
            </v-container>

            <v-container>
              <v-row>
                <v-subheader>Telegram</v-subheader>
              </v-row>
              <v-row>
                <v-select
                  v-model="telegramId"
                  :items="telegrams"
                  item-text="client_id"
                  item-value="id"
                  label="Telegram channel"
                  :rules="[v => v || 'Please select a Telegram channel']"
                  required
                ></v-select>
              </v-row>
            </v-container>

            
          </v-form>
          
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn
          @click="submit"
          :disabled="!valid"
        >
          {{ editMode ? 'Save' : 'Generate the bot'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ICryptobot, ICryptobotCreate, ICryptobotUpdate } from '@/interfaces';
import { readUserProfile, readCryptobot, readBinanceAccounts, readTelegrams } from '@/store/main/getters';
import { dispatchGetBinanceAccounts, dispatchGetCryptobot, dispatchGetTelegrams } from '@/store/main/actions';
import { dispatchCreateCryptobot, dispatchUpdateCryptobot } from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';


@Component@Component({
  components: {
  },
})
export default class CryptobotCreateOrEdit extends Vue {
  public title: string = 'Create a new bot';
  public valid = true;

  public cryptobotId: string = '';
  public userId: string = '';

  public binanceAccountId: number = 0;
  public telegramId: number = 0;
  public binanceConfigBaseCurrency: string = 'BTC';
  public binanceConfigQuoteCurrency: string = 'EUR';
  public binanceConfigGranularity: string = '15m';
  public binanceConfigLive: boolean = false;
  public binanceConfigVerbose: boolean = true;
  public binanceConfigGraphs: boolean = false;
  public binanceConfigBuymaxsize: number | null = null;
  public binanceConfigSellupperpcnt: number = 5;
  public binanceConfigSelllowerpcnt: number = -5;
  public binanceConfigDisablebullonly: boolean = false;
  public binanceConfigDisablebuynearhigh: boolean = false;
  public binanceConfigDisablebuymacd: boolean = false;
  public binanceConfigDisablebuyema: boolean = false;
  public binanceConfigDisablebuyobv: boolean = false;
  public binanceConfigDisablebuyelderray: boolean = false;
  public binanceConfigDisablefailsafefibonaccilow: boolean = false;
  public binanceConfigDisablefailsafelowerpcnt: boolean = false;
  public binanceConfigDisableprofitbankupperpcnt: boolean = false;
  public binanceConfigDisableprofitbankfibonaccihigh: boolean = false;
  public binanceConfigDisableprofitbankreversal: boolean = false;
  public loggerFilelog: boolean = false;
  public loggerLogfile: string = 'pycryptobot.log';
  public loggerFileloglevel: string = 'DEBUG';
  public loggerConsolelog: boolean = true;
  public loggerConsoleloglevel: string = 'INFO';
  public telegramClientId: string = '';
  public telegramToken: string = '';

  private editMode = false;

  private validateConfigBaseCurrency = [
    (v) => v.length > 0 || 'Required',
  ];

  private validateConfigQuoteCurrency = [
    (v) => v.length > 0 || 'Required',
  ];

  private validateConfigBuymaxsize = [
    // (v) => v !== '0' || 'Required',
    // (v) => v.length > 0 || 'Required',
    (v) => v !== null || 'Required',
    (v) => v != 0 || 'Not null required',
  ];

  private validateConfigGranularity = [
    (v) => v.length > 0 || 'Required',
    (v) => v[v.length - 1] === 'm' || 'Supported format: 15m, 60m',
  ];

  private validateConfigSellupperpcnt = [
    (v) => v != 0 || 'Required',
  ];

  private validateConfigSelllowerpcnt = [
    (v) => v != 0 || 'Required',
  ];

  private validateBinanceAccount = [
    (v) => !!v || 'Binance account is required',
  ];

  private validateLoggerConsoleloglevel = [
    (v) => v.length > 0 || 'Required',
    (v) => ['DEBUG', 'INFO', 'ERROR'].includes(v) || 'Supported format: DEBUG, INFO, ERROR',
  ];

  public async mounted() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.userId = userProfile.id;
    }
    this.editMode = this.$router.currentRoute.name === 'main-cryptobots-edit' ? true : false;
    if (this.editMode) {
      this.title = 'Edit the bot';
      this.cryptobotId = this.$router.currentRoute.params.id;
      await dispatchGetCryptobot(this.$store, this.cryptobotId);
      this.setFormValues();
    }
    dispatchGetBinanceAccounts(this.$store);
    dispatchGetTelegrams(this.$store);

  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get binanceAccounts() {
    return readBinanceAccounts(this.$store);
  }

  get telegrams() {
    return readTelegrams(this.$store);
  }

  get cryptobot() {
    return readCryptobot(this.$store);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as any).validate()) {
      if (this.editMode) {
        const updatedCryptobot: ICryptobotUpdate = {
          id: this.cryptobotId,
          binance_account_id: this.binanceAccountId,
          telegram_id: this.telegramId,
          binance_config_base_currency: this.binanceConfigBaseCurrency,
          binance_config_quote_currency: this.binanceConfigQuoteCurrency,
          binance_config_granularity: this.binanceConfigGranularity,
          binance_config_live: this.binanceConfigLive,
          binance_config_verbose : this.binanceConfigVerbose,
          binance_config_graphs: this.binanceConfigGraphs,
          binance_config_buymaxsize: this.binanceConfigBuymaxsize || 0,
          binance_config_sellupperpcnt: this.binanceConfigSellupperpcnt,
          binance_config_selllowerpcnt: this.binanceConfigSelllowerpcnt,
          binance_config_disablebullonly: this.binanceConfigDisablebullonly,
          binance_config_disablebuynearhigh: this.binanceConfigDisablebuynearhigh,
          binance_config_disablebuymacd: this.binanceConfigDisablebuymacd,
          binance_config_disablebuyema: this.binanceConfigDisablebuyema,
          binance_config_disablebuyobv: this.binanceConfigDisablebuyobv,
          binance_config_disablebuyelderray: this.binanceConfigDisablebuyelderray,
          binance_config_disablefailsafefibonaccilow: this.binanceConfigDisablefailsafefibonaccilow,
          binance_config_disablefailsafelowerpcnt: this.binanceConfigDisablefailsafelowerpcnt,
          binance_config_disableprofitbankupperpcnt: this.binanceConfigDisableprofitbankupperpcnt,
          binance_config_disableprofitbankfibonaccihigh: this.binanceConfigDisableprofitbankfibonaccihigh,
          binance_config_disableprofitbankreversal: this.binanceConfigDisableprofitbankreversal,
          logger_filelog: this.loggerFilelog,
          logger_logfile: this.loggerLogfile,
          logger_fileloglevel: this.loggerFileloglevel,
          logger_consolelog: this.loggerConsolelog,
          logger_consoleloglevel: this.loggerConsoleloglevel,
          telegram_client_id: this.telegramClientId,
          telegram_token: this.telegramToken,
        };
        await dispatchUpdateCryptobot(this.$store, updatedCryptobot);
    } else {
        const createdCryptobot: ICryptobotCreate = {
          binance_account_id: this.binanceAccountId,
          telegram_id: this.telegramId,
          binance_config_base_currency: this.binanceConfigBaseCurrency,
          binance_config_quote_currency: this.binanceConfigQuoteCurrency,
          binance_config_granularity: this.binanceConfigGranularity,
          binance_config_live: this.binanceConfigLive,
          binance_config_verbose : this.binanceConfigVerbose,
          binance_config_graphs: this.binanceConfigGraphs,
          binance_config_buymaxsize: this.binanceConfigBuymaxsize || 0,
          binance_config_sellupperpcnt: this.binanceConfigSellupperpcnt,
          binance_config_selllowerpcnt: this.binanceConfigSelllowerpcnt,
          binance_config_disablebullonly: this.binanceConfigDisablebullonly,
          binance_config_disablebuynearhigh: this.binanceConfigDisablebuynearhigh,
          binance_config_disablebuymacd: this.binanceConfigDisablebuymacd,
          binance_config_disablebuyema: this.binanceConfigDisablebuyema,
          binance_config_disablebuyobv: this.binanceConfigDisablebuyobv,
          binance_config_disablebuyelderray: this.binanceConfigDisablebuyelderray,
          binance_config_disablefailsafefibonaccilow: this.binanceConfigDisablefailsafefibonaccilow,
          binance_config_disablefailsafelowerpcnt: this.binanceConfigDisablefailsafelowerpcnt,
          binance_config_disableprofitbankupperpcnt: this.binanceConfigDisablebullonly,
          binance_config_disableprofitbankfibonaccihigh: this.binanceConfigDisablebullonly,
          binance_config_disableprofitbankreversal: this.binanceConfigDisableprofitbankreversal,
          logger_filelog: this.loggerFilelog,
          logger_logfile: this.loggerLogfile,
          logger_fileloglevel: this.loggerFileloglevel,
          logger_consolelog: this.loggerConsolelog,
          logger_consoleloglevel: this.loggerConsoleloglevel,
          telegram_client_id: this.telegramClientId,
          telegram_token: this.telegramToken,
        };
        await dispatchCreateCryptobot(this.$store, createdCryptobot);
      }

      this.$router.push('/main/cryptobots');
    }
  }

  private setFormValues() {
    const cryptobot: ICryptobot = this.cryptobot;
    this.userId = cryptobot.user_id || '';
    this.binanceAccountId = cryptobot.binance_account_id || 0;
    this.telegramId = cryptobot.telegram_id || 0;
    this.binanceConfigBaseCurrency = cryptobot.binance_config_base_currency || '';
    this.binanceConfigQuoteCurrency = cryptobot.binance_config_quote_currency || '';
    this.binanceConfigGranularity = cryptobot.binance_config_granularity || '';
    this.binanceConfigLive = cryptobot.binance_config_live || false;
    this.binanceConfigVerbose = cryptobot.binance_config_verbose || false;
    this.binanceConfigGraphs = cryptobot.binance_config_graphs || false;
    this.binanceConfigBuymaxsize = cryptobot.binance_config_buymaxsize || 0;
    this.binanceConfigSellupperpcnt = cryptobot.binance_config_sellupperpcnt || 0;
    this.binanceConfigSelllowerpcnt = cryptobot.binance_config_selllowerpcnt || 0;
    this.binanceConfigDisablebullonly = cryptobot.binance_config_disablebullonly || false;
    this.binanceConfigDisablebuynearhigh = cryptobot.binance_config_disablebuynearhigh || false;
    this.binanceConfigDisablebuymacd = cryptobot.binance_config_disablebuymacd || false;
    this.binanceConfigDisablebuyema = cryptobot.binance_config_disablebuyema || false;
    this.binanceConfigDisablebuyobv = cryptobot.binance_config_disablebuyobv || false;
    this.binanceConfigDisablebuyelderray = cryptobot.binance_config_disablebuyelderray || false;
    this.binanceConfigDisablefailsafefibonaccilow = cryptobot.binance_config_disablefailsafefibonaccilow || false;
    this.binanceConfigDisablefailsafelowerpcnt = cryptobot.binance_config_disablefailsafelowerpcnt || false;
    this.binanceConfigDisableprofitbankupperpcnt = cryptobot.binance_config_disableprofitbankupperpcnt || false;
    this.binanceConfigDisableprofitbankfibonaccihigh = cryptobot.binance_config_disableprofitbankfibonaccihigh || false;
    this.binanceConfigDisableprofitbankreversal = cryptobot.binance_config_disableprofitbankreversal || false;
    this.loggerFilelog = cryptobot.logger_filelog || false;
    this.loggerLogfile = cryptobot.logger_logfile || 'pycryptobot.log';
    this.loggerFileloglevel = cryptobot.logger_fileloglevel || 'DEBUG';
    this.loggerConsolelog = cryptobot.logger_consolelog || false;
    this.loggerConsoleloglevel = cryptobot.logger_consoleloglevel || 'DEBUG';
    this.telegramClientId = cryptobot.telegram_client_id || '';
    this.telegramToken = cryptobot.telegram_token || '';
  }

  private binanceConfigLiveLabel(live: boolean) {
    return live ? 'Live: real funds!' : 'Dry-run: dummy funds. Useful for discovery.';
  }

}

</script>

<style>
</style>
