<template>
  <v-container>
    <v-card class="ma-3 pa-3" min-width="400px" max-width="100%">
      <v-card-title primary-title>
        <div class="headline primary--text">{{ title }}</div>
      </v-card-title>
      <v-card-text>
        <template>

            <v-container >
              <v-row>
                <v-subheader>Currency</v-subheader>
              </v-row>
              <v-row>
                <v-text-field
                  disabled
                  :value=binanceConfigBaseCurrency
                  label="Base currency"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  disabled
                  :value=binanceConfigQuoteCurrency
                  label="Quote currency"
                ></v-text-field>
              </v-row>
            </v-container>
            

        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ICryptobot } from '@/interfaces';
import { readUserProfile, readCryptobot } from '@/store/main/getters';
import { dispatchGetCryptobot } from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';

@Component
export default class CryptobotCreateOrEdit extends Vue {
  public title: string = 'Generate a bot';
  public valid = true;

  public cryptobotId: string | null = null;
  public userId: string = '';

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
  public binanceConfigBuy: number = -5;
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
    }
    this.title = 'View bot';
    this.cryptobotId = this.$router.currentRoute.params.id;
    await dispatchGetCryptobot(this.$store, this.cryptobotId);
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get cryptobot() {
    return readCryptobot(this.$store);
  }

}

</script>

<style scoped>
</style>
