<template>
  <v-container ma-0 pa-0 fluid>
    <v-data-table
      :headers="headers"
      :items="telegrams"
      :options.sync="pagination"
      :footer-props.sync="paginationFooter"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Manage Telegram channels</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
                color="primary"
                dark
                class="mb-2"
                to="/main/telegrams/create"
              >
                Add a Telegram channel
              </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.created_on`]="{ item }">
        {{ getDatetimePretty(item.created_on) }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn slot="activator" text :to="{name: 'main-telegrams-view', params: {id: item.id}}">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn slot="activator" text :to="{name: 'main-telegrams-edit', params: {id: item.id}}">
          <v-icon>mdi-pen</v-icon>
        </v-btn>
        <v-btn slot="activator" text @click="showDeleteDialog(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteTelegramDialog" max-width="500px">
      <v-card>
        <v-card-title>Delete</v-card-title>
        <v-card-text>Confirm deletion</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="deleteTelegramDialog = false">Close</v-btn>
          <v-btn color="primary" text @click="deleteTelegram()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile, readTelegrams } from '@/store/main/getters';
import { dispatchGetTelegrams, dispatchRemoveTelegram } from '@/store/main/actions';
import moment from 'moment';

@Component
export default class Telegrams extends Vue {

  public pagination = {
    sortBy: ['id'],
    sortDesc: true,
  };
  public paginationFooter = {
    itemsPerPageOptions: [5, 10, { text: 'All', value: -1 }],
  };
  public headers = [
    {
      text: 'Client ID',
      sortable: true,
      value: 'client_id',
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

  public deletetelegramId;
  public deleteTelegramDialog: boolean = false;


  get telegrams() {
    return readTelegrams(this.$store);
  }

  public async mounted() {
    await dispatchGetTelegrams(this.$store);
  }

  public showDeleteDialog(telegramId) {
      this.deletetelegramId = telegramId;
      this.deleteTelegramDialog = !this.deleteTelegramDialog;
  }

  public async deleteTelegram() {
      await dispatchRemoveTelegram(this.$store, this.deletetelegramId);
      await dispatchGetTelegrams(this.$store);
      this.deleteTelegramDialog = !this.deleteTelegramDialog;
      delete this.deletetelegramId;
  }

  public getDatetimePretty(datetime) {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
  }

}
</script>

<style scoped>
.container {
  max-width: 960px;
}
</style>