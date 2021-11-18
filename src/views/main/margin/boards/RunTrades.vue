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

    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile, readMarginCurrencies } from '@/store/main/getters';
import { dispatchGetMarginCurrencies, dispatchRemoveMarginCurrency } from '@/store/main/actions';
import moment from 'moment';

@Component
export default class MarginCurrencies extends Vue {

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
    return readMarginCurrencies(this.$store);
  }

  public async mounted() {
    await dispatchGetMarginCurrencies(this.$store);
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