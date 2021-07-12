<template>
  <v-container>
    <v-card class="ma-3 pa-3" max-width="800px" style="margin-left: 0px;">
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
                    />
                  </v-flex>
                  <v-flex grow>
                  </v-flex>
                  <v-flex grow>
                    <v-text-field
                      label="Quote currency"
                      v-model="binanceConfigQuoteCurrency"
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
                    />
                  </v-flex>
                  <v-flex grow>
                  </v-flex>
                  <v-flex grow>
                    <v-text-field
                      label="Granularity"
                      v-model="binanceConfigGranularity"
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
                <v-text-field
                  label="Binance API Key"
                  v-model="binanceApiKey"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  label="Binance API Secret"
                  v-model="binanceApiSecret"
                ></v-text-field>
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
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  label="Token"
                  v-model="telegramToken"
                ></v-text-field>
              </v-row>
            </v-container>
            
          </v-form>
          
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Annuler</v-btn>
        <v-btn
          @click="submit"
          :disabled="!valid"
        >
          {{ editMode ? 'Enregistrer' : 'Generate the bot'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ICryptobot, ICryptobotCreate } from '@/interfaces';
import { readUserProfile, readCryptobot } from '@/store/main/getters';
import { dispatchGetCryptobot } from '@/store/main/actions';
import { dispatchCreateCryptobot, dispatchUpdateCryptobot } from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';


@Component@Component({
  components: {
  },
})
export default class CryptobotCreateOrEdit extends Vue {
  public title: string = 'Create a new bot';
  public valid = true;

  public cryptobotId: string | null = null;
  public userId: string = '';

  public customer: string = this.userId.toString();
  public binanceApiUrl: string = 'https://api.binance.com';
  public binanceApiKey: string = '';
  public binanceApiSecret: string = '';
  public binanceConfigBaseCurrency: string = 'btc';
  public binanceConfigQuoteCurrency: string = 'eur';
  public binanceConfigGranularity: string = '15m';
  public binanceConfigLive: boolean = false;
  public binanceConfigVerbose: boolean = true;
  public binanceConfigGraphs: boolean = false;
  public binanceConfigBuymaxsize: number = 1;
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

  public async mounted() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.userId = userProfile.id;
      console.log(userProfile.id, this.userId, this.userId.toString());
    }
    this.editMode = this.$router.currentRoute.name === 'main-cryptobots-edit' ? true : false;
    if (this.editMode) {
      this.title = 'Edit the bot';
      this.cryptobotId = this.$router.currentRoute.params.id;
      await dispatchGetCryptobot(this.$store, this.cryptobotId);
      this.setFormValues();
    }
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get cryptobot() {
    return readCryptobot(this.$store);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as any).validate()) {
      const updatedCryptobot: ICryptobotCreate = {
        user_id: this.userId,
        customer: this.userId,
        binance_api_url: this.binanceApiUrl,
        binance_api_key: this.binanceApiKey,
        binance_api_secret: this.binanceApiSecret,
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

      if (this.editMode) {
        updatedCryptobot.id =  this.cryptobot.id;
      }

      this.editMode ?
        await dispatchUpdateCryptobot(this.$store, updatedCryptobot) :
        await dispatchCreateCryptobot(this.$store, updatedCryptobot);

      this.$router.push('/main/cryptobots');
    }
  }

  private setFormValues() {
    const cryptobot: ICryptobot = this.cryptobot;
    this.userId = cryptobot.user_id || '';
    this.binanceApiUrl = cryptobot.binance_api_url || '';
    this.binanceApiKey = cryptobot.binance_api_key || '';
    this.binanceApiSecret = cryptobot.binance_api_secret || '';
    this.binanceConfigBaseCurrency = cryptobot.binance_config_base_currency || '';
    this.binanceConfigQuoteCurrency = cryptobot.binance_config_quote_currency || '';
    this.binanceConfigGranularity = cryptobot.binance_config_granularity || '';
    this.binanceConfigLive = cryptobot.binance_config_live || false;
    this.binanceConfigVerbose = cryptobot.binance_config_verbose || false;
    this.binanceConfigGraphs = cryptobot.binance_config_graphs || false;
    this.binanceConfigBuymaxsize = cryptobot.binance_config_buymaxsize || 1;
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
