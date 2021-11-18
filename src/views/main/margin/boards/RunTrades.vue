<template>
  <v-container ma-0 pa-0 fluid>
    <v-data-table
      :headers="headers"
      :items="currencies"
      :options.sync="pagination"
      :footer-props.sync="paginationFooter"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Margin board</v-toolbar-title>
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

      <template v-slot:[`item.wallet.volume`]="{ item }">
        {{ item.wallet.volume }} {{ item.base_currency }}
      </template>
      <template v-slot:[`item.margin.percent`]="{ item }">
        {{ item.margin.percent }} %
      </template>
      <template v-slot:[`item.margin.value`]="{ item }">
        {{ item.margin.value }} {{ item.quote_currency}}
      </template>

    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile, readMarginBoardTradesRun } from '@/store/main/getters';
import { dispatchGetMarginBoardTradesRun } from '@/store/main/actions';
import moment from 'moment';

@Component
export default class MarginBoardTradesRun extends Vue {

  public pagination = {
    sortBy: ['id'],
    sortDesc: true,
  };
  public paginationFooter = {
    itemsPerPageOptions: [5, 10, { text: 'All', value: -1 }],
  };
  public headers = [
    {
      text: 'Base currency',
      sortable: true,
      value: 'base_currency',
      align: 'left',
    },
    {
      text: 'Quote currency',
      sortable: true,
      value: 'quote_currency',
      align: 'left',
    },
    {
      text: 'Market price',
      sortable: true,
      value: 'market.price',
      align: 'left',
    },
    {
      text: 'Wallet price',
      sortable: true,
      value: 'wallet.price',
      align: 'left',
    },
    {
      text: 'Wallet volume',
      sortable: true,
      value: 'wallet.volume',
      align: 'left',
    },
    {
      text: 'Margin percent',
      sortable: true,
      value: 'margin.percent',
      align: 'left',
    },
    {
      text: 'Margin value',
      sortable: true,
      value: 'margin.value',
      align: 'left',
    },
  ];


  get currencies() {
    return readMarginBoardTradesRun(this.$store);
  }

  public async mounted() {
    await dispatchGetMarginBoardTradesRun(this.$store);
  }

  public getDatetimePretty(datetime) {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
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