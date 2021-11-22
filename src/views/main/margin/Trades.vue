<template>
  <v-container ma-0 pa-0 fluid>
    <v-data-table
      :headers="headers"
      :items="currencies"
      :sort-by="pagination.sortBy"
      :sort-desc="pagination.sortDesc"
      :footer-props.sync="paginationFooter"
      class="elevation-1"
      loading
      loading-text="Loading... Please wait"
      :search="search"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Trades margin board</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn
                color="primary"
                dark
                class="mb-2"
                to="/main/margin/currency/create"
              >
                Add a currency
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`header.base_currency`]="{}">
        <div>Base</div>
        <div>Currency</div>
      </template>
      <template v-slot:[`header.quote_currency`]="{}">
        <div>Quote</div>
        <div>Currency</div>
      </template>
      <template v-slot:[`header.market.price`]="{}">
        <div>Market</div>
        <div>Price</div>
      </template>
      <template v-slot:[`header.wallet.volume`]="{}">
        <div>Wallet</div>
        <div>Volume (Price)</div>
      </template>
      <template v-slot:[`header.last_trade.volume`]="{}">
        <div>Last trade</div>
        <div>Volume (Price)</div>
      </template>
      <template v-slot:[`header.last_trade.value`]="{}">
        <div>Last trade</div>
        <div>Value</div>
      </template>
      <template v-slot:[`header.last_trade.margin.value`]="{}">
        <div>Last trade</div>
        <div>Margin value</div>
      </template>
      <template v-slot:[`header.last_trade.margin.percent`]="{}">
        <div>Last trade</div>
        <div>Margin percent</div>
      </template>
      <template v-slot:[`header.last_run.volume`]="{}">
        <div>Last run</div>
        <div>Volume (Price)</div>
      </template>
      <template v-slot:[`header.last_run.value`]="{}">
        <div>Last run</div>
        <div>Value</div>
      </template>
      <template v-slot:[`header.last_run.margin.value`]="{}">
        <div>Last run</div>
        <div>Margin value</div>
      </template>
      <template v-slot:[`header.last_run.margin.percent`]="{}">
        <div>Last run</div>
        <div>Margin percent</div>
      </template>

      <template v-slot:[`item.market.price`]="{ item }">
        {{ item.market.price }} {{ item.quote_currency }}
      </template>
      <template v-slot:[`item.wallet.volume`]="{ item }">
        <div>
          {{ item.wallet.volume }} {{ item.base_currency }}
        </div>
        <div>
          ({{ item.wallet.price }} {{ item.quote_currency }})
        </div>
      </template>
      <template v-slot:[`item.last_trade.volume`]="{ item }">
        <div>
          {{ item.last_trade.volume.toFixed(2) }} {{ item.base_currency }}
        </div>
        <div>
          ({{ item.last_trade.price.toFixed(2) }} {{ item.quote_currency }})
        </div>
      </template>
      <!-- <template v-slot:[`item.last_trade.volume`]="{ item }">
        {{ item.last_trade.volume.toFixed(2) }} {{ item.base_currency }} ({{ item.last_trade.price.toFixed(2) }} {{ item.quote_currency }})
      </template> -->
      <template v-slot:[`item.last_trade.value`]="{ item }">
        {{ item.last_trade.value.toFixed(2) }} {{ item.quote_currency }}
      </template>
      <template v-slot:[`item.last_trade.margin.value`]="{ item }">
        {{ item.last_trade.margin.value.toFixed(2) }} {{ item.quote_currency}}
      </template>
      <template v-slot:[`item.last_trade.margin.percent`]="{ item }">
        <v-chip
          :color="getValueColor(item.last_trade.margin.percent)"
          dark
        >
          {{ item.last_trade.margin.percent.toFixed(2) }} %
        </v-chip>
      </template>
      <template v-slot:[`item.last_run.volume`]="{ item }">
        <div>
          {{ item.last_run.volume.toFixed(2) }} {{ item.base_currency }}
        </div>
        <div>
          ({{ item.last_run.price.toFixed(2) }} {{ item.quote_currency }})
        </div>
      </template>
      <template v-slot:[`item.last_run.value`]="{ item }">
        {{ item.last_run.value.toFixed(2) }} {{ item.quote_currency }}
      </template>
      <template v-slot:[`item.last_run.margin.value`]="{ item }">
          {{ item.last_run.margin.value.toFixed(2) }} {{ item.quote_currency}}
      </template>
      <template v-slot:[`item.last_run.margin.percent`]="{ item }">
        <v-chip
          :color="getValueColor(item.last_run.margin.percent)"
          dark
        >
          {{ item.last_run.margin.percent.toFixed(2) }} %
        </v-chip>
      </template>

    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile, readMarginBoardTrades } from '@/store/main/getters';
import { dispatchGetMarginBoardTrades } from '@/store/main/actions';
import moment from 'moment';

@Component
export default class MarginBoardTrades extends Vue {

  public pagination = {
    sortBy: ['quote_currency', 'base_currency'],
    sortDesc: [false, false],
  };
  public paginationFooter = {
    itemsPerPageOptions: [20, 50, { text: 'All', value: -1 }],
  };
  public headers = [
    {
      text: 'Base',
      sortable: true,
      value: 'base_currency',
      align: 'left',
    },
    {
      text: 'Quote',
      sortable: true,
      value: 'quote_currency',
      align: 'left',
    },
    {
      text: 'Market price',
      sortable: true,
      value: 'market.price',
      align: 'right',
    },
    {
      text: 'Wallet volume (price)',
      sortable: true,
      value: 'wallet.volume',
      align: 'right',
    },
    {
      text: 'Last trade volume (price)',
      sortable: true,
      value: 'last_trade.volume',
      align: 'right',
    },
    {
      text: 'Last trade value',
      sortable: true,
      value: 'last_trade.value',
      align: 'right',
    },
    {
      text: 'Last trade margin value',
      sortable: true,
      value: 'last_trade.margin.value',
      align: 'right',
    },
    {
      text: 'Last trade margin percent',
      sortable: true,
      value: 'last_trade.margin.percent',
      align: 'right',
    },
    {
      text: 'Last run volume (price)',
      sortable: true,
      value: 'last_run.volume',
      align: 'right',
    },
    {
      text: 'Last run value',
      sortable: true,
      value: 'last_run.value',
      align: 'right',
    },
    {
      text: 'Last run margin value',
      sortable: true,
      value: 'last_run.margin.value',
      align: 'right',
    },
    {
      text: 'Last run margin percent',
      sortable: true,
      value: 'last_run.margin.percent',
      align: 'right',
    },
  ];
  public search: string = '';


  get currencies() {
    return readMarginBoardTrades(this.$store);
  }

  public async mounted() {
    await dispatchGetMarginBoardTrades(this.$store);
  }

  public getDatetimePretty(datetime) {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
  }

  public getValueColor(value: number) {
    if (value > 0) {
      return 'green';
    } else if (value < 0) {
      return 'red';
    } else {
      return 'grey';
    }
  }

}
</script>

<style scoped>
/* 
.container {
  max-width: 960px;
}
 */
</style>