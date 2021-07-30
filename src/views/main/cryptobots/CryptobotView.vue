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
                  :value=cryptobot.binance_config_base_currency
                  label="Base currency"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  disabled
                  :value=cryptobot.binance_config_quote_currency
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

  public binanceAccountId: number = 0;
  public binanceConfigBaseCurrency: string = '';
  public binanceConfigQuoteCurrency: string = '';
  public binanceConfigGranularity: string = '';
  public binanceConfigLive: boolean = false;
  public binanceConfigVerbose: boolean = false;
  public binanceConfigGraphs: boolean = false;
  public binanceConfigBuymaxsize: number = 0;
  public binanceConfigSellupperpcnt: number = 0;
  public binanceConfigSelllowerpcnt: number = 0;
  public binanceConfigBuy: number = 0;
  public loggerFilelog: boolean = false;
  public loggerLogfile: string = '';
  public loggerFileloglevel: string = '';
  public loggerConsolelog: boolean = true;
  public loggerConsoleloglevel: string = '';
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
