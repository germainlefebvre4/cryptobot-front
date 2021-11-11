<template>
  <v-container ma-0 pa-0>
    <v-card>
      <v-card-title primary-title>
        <div class="headline primary--text">{{ title }}</div>
      </v-card-title>
      <v-card-text>
        <template>

          <v-chip
            class="ma-2"
            color="secondary"
            @click="openLink('https://github.com/whittlem/pycryptobot')"
          >
            whittlem/pycryptobot
          </v-chip>
          <v-chip
            class="ma-2"
            color="primary"
          >
            {{ cryptobotVersion.version }}
          </v-chip>

          <v-card outlined color="transparent">
            <v-card-title>
              <div class="headline">
                <v-icon>mdi-cog</v-icon>
                <span class="headline">
                  Configuration
                </span>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container >
                <v-row>
                    Currency: {{ cryptobot.binance_config_base_currency }}{{ cryptobot.binance_config_quote_currency }}
                </v-row>
              </v-container>

            </v-card-text>
          </v-card>


          <v-card style="margin-top: 15px;" outlined color="transparent">
            <v-card-title>
              <div class="headline">
                <v-icon>mdi-chart-line</v-icon>
                <span class="headline">
                  Margin
                </span>
              </div>
            </v-card-title>
            <v-card-text>
              <v-container >
                <v-row>
                    Last trade: {{ getCryptobotMarginTradesCurrentLastText(this.cryptobotMarginTradesCurrentLast) }}
                </v-row>
                <v-row>
                    Current run: {{ getCryptobotMarginTradesCurrentRunText(this.cryptobotMarginTradesCurrentRun) }}
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>


          <v-card style="margin-top: 15px;" outlined color="transparent">
            <v-card-title>
              <div class="headline">
                <v-icon>mdi-chart-line</v-icon>
                <span class="headline">
                  Status
                </span>
              </div>
            </v-card-title>
            <v-card-text>
              <v-icon :style="{ color: getCryptobotStatusColor(cryptobotStatus.status) }">{{ getCryptobotStatusIcon(cryptobotStatus.status) }}</v-icon> {{ cryptobotStatus.status }}
            </v-card-text>
          </v-card>

          <v-card style="margin-top: 15px;" outlined color="transparent">
            <v-card-title>
              <div class="headline">
                <v-icon>mdi-format-align-justify</v-icon>
                <span class="headline">
                  Logs
                </span>
              </div>
            </v-card-title>
            <v-card-text v-html="cryptobotLogs.logs" class="codeblock">
              {{ html }}
            </v-card-text>
          </v-card>

            
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ICryptobot, ICryptobotMarginTradesCurrentLast } from '@/interfaces';
import {
    readUserProfile,
    readCryptobot, readCryptobotStatus, readCryptobotVersion, readCryptobotLogs,
    readCryptobotMarginTradesCurrentLast, readCryptobotMarginTradesCurrentRun,
} from '@/store/main/getters';
import {
    dispatchGetCryptobot,
    dispatchGetCryptobotLogs, dispatchGetCryptobotStatus, dispatchGetCryptobotVersion,
    dispatchGetCryptobotMarginTradesCurrentLast, dispatchGetCryptobotMarginTradesCurrentRun,
} from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';

@Component
export default class CryptobotCreateOrEdit extends Vue {
  public title: string = 'Generate a bot';
  public html: string = '';

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

  public cryptobotStatusColor = '';
  public cryptobotStatusIcon = '';

  private editMode = false;

  public async mounted() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.userId = userProfile.id;
    }
    this.title = 'View bot';
    this.cryptobotId = this.$router.currentRoute.params.id;
    dispatchGetCryptobot(this.$store, this.cryptobotId);
    dispatchGetCryptobotStatus(this.$store, this.cryptobotId);
    dispatchGetCryptobotVersion(this.$store, this.cryptobotId);
    dispatchGetCryptobotLogs(this.$store, this.cryptobotId);
    dispatchGetCryptobotMarginTradesCurrentLast(this.$store, this.cryptobotId);
    dispatchGetCryptobotMarginTradesCurrentRun(this.$store, this.cryptobotId);
  }

  public openLink(url: string) {
    window.open(url, '_blank');
  }

  public getCryptobotStatusIcon(status: string) {
    if (status === 'RUNNING') {
      return 'mdi-play';
    } else {
      return 'mdi-stop';
    }
  }

  public getCryptobotStatusColor(status: string) {
    if (status === 'RUNNING') {
      return 'green';
    } else {
      return 'red';
    }
  }

  public getCryptobotMarginTradesCurrentLastText(margin: ICryptobotMarginTradesCurrentLast) {
    if (margin.percent !== null) {
      return margin.percent + '%';
    } else {
      return 'Unknown value.';
    }
  }

  public getCryptobotMarginTradesCurrentRunText(margin: ICryptobotMarginTradesCurrentLast) {
    if (margin.percent !== null) {
      return `${margin.quote_currency.value} ${margin.quote_currency.unit}`;
    } else {
      return 'Unknown value.';
    }
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get cryptobot() {
    return readCryptobot(this.$store);
  }

  get cryptobotStatus() {
    return readCryptobotStatus(this.$store);
  }

  get cryptobotLogs() {
    return readCryptobotLogs(this.$store);
  }

  get cryptobotVersion() {
    return readCryptobotVersion(this.$store);
  }

  get cryptobotMarginTradesCurrentLast() {
    return readCryptobotMarginTradesCurrentLast(this.$store);
  }

  get cryptobotMarginTradesCurrentRun() {
    return readCryptobotMarginTradesCurrentRun(this.$store);
  }

}

</script>

<style scoped>
.codeblock {
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
}
</style>
