<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="cryptobots"
      :sort-by.sync="pagination.sortBy"
      :sort-desc.sync="pagination.sortDesc"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Manage bots</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
                color="primary"
                dark
                class="mb-2"
                to="/main/cryptobots/create"
              >
                Create a bot
              </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn slot="activator" text :to="{name: 'main-cryptobots-view', params: {id: item.id}}">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn slot="activator" text :to="{name: 'main-cryptobots-edit', params: {id: item.id}}">
          <v-icon>mdi-pen</v-icon>
        </v-btn>
        <v-btn slot="activator" text @click="showDeleteDialog(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteCryptobotDialog" max-width="500px">
      <v-card>
        <v-card-title>Supprimer</v-card-title>
        <v-card-text>Confirmer la suppression</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="deleteCryptobotDialog = false">Fermer</v-btn>
          <v-btn color="primary" text @click="deleteCryptobot()">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile, readCryptobots } from '@/store/main/getters';
import { dispatchGetCryptobots, dispatchRemoveCryptobot } from '@/store/main/actions';

@Component
export default class Cryptobots extends Vue {

  public test = {enabled: true};
  public pagination = {sortBy: 'ID', sortDesc: true};
  public headers = [
    {
      text: 'Live',
      sortable: true,
      value: 'binance_config_live',
      align: 'left',
    },
    {
      text: 'Base currency',
      sortable: true,
      value: 'binance_config_base_currency',
      align: 'left',
    },
    {
      text: 'Quote currency',
      sortable: true,
      value: 'binance_config_quote_currency',
      align: 'left',
    },
  ];

  public deletecryptobotId;
  public deleteCryptobotDialog: boolean = false;


  get cryptobots() {
    return readCryptobots(this.$store);
  }

  public async mounted() {
    await dispatchGetCryptobots(this.$store);
  }

  public showDeleteDialog(item) {
      this.deletecryptobotId = item;
      this.deleteCryptobotDialog = !this.deleteCryptobotDialog;
  }

  public async deleteCryptobot() {
      await dispatchRemoveCryptobot(this.$store, this.deletecryptobotId);
      await dispatchGetCryptobots(this.$store);
      this.deleteCryptobotDialog = !this.deleteCryptobotDialog;
      delete this.deletecryptobotId;
  }

}
</script>