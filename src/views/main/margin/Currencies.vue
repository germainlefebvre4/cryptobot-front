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
          <v-toolbar-title>Manage margin currencies</v-toolbar-title>
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

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn slot="activator" text @click="showDeleteDialog(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteCurrencyDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete</v-card-title>
        <v-card-text>Confirm deletion</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="deleteCurrencyDialog = false">Close</v-btn>
          <v-btn color="primary" text @click="deleteCurrency()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      text: 'Actions',
      value: 'actions',
      align: 'center',
      sortable: false,
    },
  ];

  public deleteCurrencyId;
  public deleteCurrencyDialog: boolean = false;


  get currencies() {
    return readMarginCurrencies(this.$store);
  }

  public async mounted() {
    await dispatchGetMarginCurrencies(this.$store);
  }

  public showDeleteDialog(telegramId) {
      this.deleteCurrencyId = telegramId;
      this.deleteCurrencyDialog = !this.deleteCurrencyDialog;
  }

  public async deleteCurrency() {
      await dispatchRemoveMarginCurrency(this.$store, this.deleteCurrencyId);
      await dispatchGetMarginCurrencies(this.$store);
      this.deleteCurrencyDialog = !this.deleteCurrencyDialog;
      delete this.deleteCurrencyId;
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