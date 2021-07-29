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
                      :label="`Live: ${binanceConfigLive.toString()}`"
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

            <v-container>
              <v-row>
                <v-subheader>Config</v-subheader>
              </v-row>
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
                      label="Buy upper  percent"
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
                <v-subheader>Logger</v-subheader>
              </v-row>
              <v-row>
                <v-text-field
                  label="Console Loglevel"
                  v-model="loggerConsoleloglevel"
                  :rules="validateLoggerConsoleloglevel"
                ></v-text-field>
              </v-row>
            </v-container>
            
            <v-container>
              <v-row>
                <v-subheader>Telegram</v-subheader>
              </v-row>
              <v-row>
                <v-text-field
                  label="Client ID"
                  v-model="telegramClientId"
                  :rules="validateTelegramClientId"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  label="Token"
                  v-model="telegramToken"
                  :rules="validateTelegramToken"
                ></v-text-field>
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
import { readUserProfile, readCryptobot, readBinanceAccounts } from '@/store/main/getters';
import { dispatchGetBinanceAccounts, dispatchGetCryptobot } from '@/store/main/actions';
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
  public binanceConfigBaseCurrency: string = 'BTC';
  public binanceConfigQuoteCurrency: string = 'EUR';
  public binanceConfigGranularity: string = '15m';
  public binanceConfigLive: boolean = false;
  public binanceConfigVerbose: boolean = true;
  public binanceConfigGraphs: boolean = false;
  public binanceConfigBuymaxsize: number = 0;
  public binanceConfigSellupperpcnt: number = 5;
  public binanceConfigSelllowerpcnt: number = -5;
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
    (v) => v != 0 || 'Required',
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

  private validateTelegramClientId = [
    (v) => v.length > 0 || 'Please fill the Telegram Client ID',
  ];

  private validateTelegramToken = [
    (v) => v.length > 0 || 'Please fill the Telegram Token',
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
    await dispatchGetBinanceAccounts(this.$store);
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get binanceAccounts() {
    return readBinanceAccounts(this.$store);
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
          binance_config_base_currency: this.binanceConfigBaseCurrency,
          binance_config_quote_currency: this.binanceConfigQuoteCurrency,
          binance_config_granularity: this.binanceConfigGranularity,
          binance_config_live: this.binanceConfigLive,
          binance_config_verbose : this.binanceConfigVerbose,
          binance_config_graphs: this.binanceConfigGraphs,
          binance_config_buymaxsize: this.binanceConfigBuymaxsize,
          binance_config_sellupperpcnt: this.binanceConfigSellupperpcnt,
          binance_config_selllowerpcnt: this.binanceConfigSelllowerpcnt,
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
          binance_config_base_currency: this.binanceConfigBaseCurrency,
          binance_config_quote_currency: this.binanceConfigQuoteCurrency,
          binance_config_granularity: this.binanceConfigGranularity,
          binance_config_live: this.binanceConfigLive,
          binance_config_verbose : this.binanceConfigVerbose,
          binance_config_graphs: this.binanceConfigGraphs,
          binance_config_buymaxsize: this.binanceConfigBuymaxsize,
          binance_config_sellupperpcnt: this.binanceConfigSellupperpcnt,
          binance_config_selllowerpcnt: this.binanceConfigSelllowerpcnt,
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
    this.binanceAccounts.forEach((account) => {
      if (parseInt(account.id || '', 10) === cryptobot.binance_account_id) {
        this.binanceAccountId = parseInt(account.id || '', 10);
      }
    });
    this.binanceConfigBaseCurrency = cryptobot.binance_config_base_currency || '';
    this.binanceConfigQuoteCurrency = cryptobot.binance_config_quote_currency || '';
    this.binanceConfigGranularity = cryptobot.binance_config_granularity || '';
    this.binanceConfigLive = cryptobot.binance_config_live || false;
    this.binanceConfigVerbose = cryptobot.binance_config_verbose || false;
    this.binanceConfigGraphs = cryptobot.binance_config_graphs || false;
    this.binanceConfigBuymaxsize = cryptobot.binance_config_buymaxsize || 0;
    this.binanceConfigSellupperpcnt = cryptobot.binance_config_sellupperpcnt || 0;
    this.binanceConfigSelllowerpcnt = cryptobot.binance_config_selllowerpcnt || 0;
    this.loggerFilelog = cryptobot.logger_filelog || false;
    this.loggerLogfile = cryptobot.logger_logfile || 'pycryptobot.log';
    this.loggerFileloglevel = cryptobot.logger_fileloglevel || 'DEBUG';
    this.loggerConsolelog = cryptobot.logger_consolelog || false;
    this.loggerConsoleloglevel = cryptobot.logger_consoleloglevel || 'DEBUG';
    this.telegramClientId = cryptobot.telegram_client_id || '';
    this.telegramToken = cryptobot.telegram_token || '';
  }
}

</script>

<style>
</style>
