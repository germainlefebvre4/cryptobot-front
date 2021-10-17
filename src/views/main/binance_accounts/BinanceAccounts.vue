<template>
  <v-container ma-0 pa-0 fluid>
    <v-data-table
      :headers="headers"
      :items="binanceAccounts"
      :options.sync="pagination"
      :footer-props.sync="paginationFooter"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Manage Binance accounts</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
                color="primary"
                dark
                class="mb-2"
                to="/main/binance/accounts/create"
              >
                Add a Binance account
              </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.created_on`]="{ item }">
        {{ getDatetimePretty(item.created_on) }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn slot="activator" text :to="{name: 'main-binance-accounts-view', params: {id: item.id}}">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn slot="activator" text :to="{name: 'main-binance-accounts-edit', params: {id: item.id}}">
          <v-icon>mdi-pen</v-icon>
        </v-btn>
        <v-btn slot="activator" text @click="showDeleteDialog(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteBinanceAccountDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete</v-card-title>
        <v-card-text>Confirm deletion</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="deleteBinanceAccountDialog = false">Close</v-btn>
          <v-btn color="primary" text @click="deleteBinanceAccount()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile, readBinanceAccounts } from '@/store/main/getters';
import { dispatchGetBinanceAccounts, dispatchRemoveBinanceAccount } from '@/store/main/actions';
import moment from 'moment';

@Component
export default class BinanceAccounts extends Vue {

  public pagination = {
    sortBy: ['id'],
    sortDesc: true,
  };
  public paginationFooter = {
    itemsPerPageOptions: [5, 10, { text: 'All', value: -1 }],
  };
  public headers = [
    {
      text: 'API Key',
      sortable: true,
      value: 'binance_api_key',
      align: 'left',
    },
    {
      text: 'Creation date',
      sortable: true,
      value: 'created_on',
      align: 'left',
    },
    {
      text: 'Actions',
      value: 'actions',
      align: 'center',
      sortable: false,
    },
  ];

  public deletebinanceAccountId;
  public deleteBinanceAccountDialog: boolean = false;


  get binanceAccounts() {
    return readBinanceAccounts(this.$store);
  }

  public async mounted() {
    await dispatchGetBinanceAccounts(this.$store);
  }

  public showDeleteDialog(binanceAccountId) {
      this.deletebinanceAccountId = binanceAccountId;
      this.deleteBinanceAccountDialog = !this.deleteBinanceAccountDialog;
  }

  public async deleteBinanceAccount() {
      await dispatchRemoveBinanceAccount(this.$store, this.deletebinanceAccountId);
      await dispatchGetBinanceAccounts(this.$store);
      this.deleteBinanceAccountDialog = !this.deleteBinanceAccountDialog;
      delete this.deletebinanceAccountId;
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