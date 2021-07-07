<template>
  <div>
    <v-toolbar light>
      <v-toolbar-title>
        Manage Users
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/main/admin/users/create">Create User</v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="users">
      <template v-slot:[`item.is_user`]="{ item }">
        <v-icon v-if="item.is_user">mdi-checkbox-marked-circle-outline</v-icon>
        <v-icon v-else>mdi-checkbox-blank-circle-outline</v-icon>
      </template>
      <template v-slot:[`item.is_active`]="{ item }">
        <v-icon v-if="item.is_active">mdi-checkbox-marked-circle-outline</v-icon>
        <v-icon v-else>mdi-checkbox-blank-circle-outline</v-icon>
      </template>
      <template v-slot:[`item.is_superuser`]="{ item }">
        <v-icon v-if="item.is_superuser">mdi-checkbox-marked-circle-outline</v-icon>
        <v-icon v-else>mdi-checkbox-blank-circle-outline</v-icon>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <td class="justify-center layout px-0">
          <v-btn slot="activator" text :to="{name: 'main-admin-users-edit', params: {id: item.id}}">
            <v-icon>mdi-pen</v-icon>
          </v-btn>
          <v-btn slot="activator" text @click="showDeleteDialog(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteUserDialog" max-width="500px">
      <v-card>
        <v-card-title>Supprimer (non implémenté)</v-card-title>
        <v-card-text>Confirmer la suppression</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="deleteUserDialog = false">Fermer</v-btn>
          <!--<v-btn color="primary" text @click="deleteUser()">Supprimer</v-btn>-->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { IUserProfile } from '@/interfaces';
import { readAdminUsers } from '@/store/admin/getters';
import { dispatchGetUsers, dispatchRemoveUser } from '@/store/admin/actions';

@Component
export default class AdminUsers extends Vue {
  public headers = [
    {
      text: 'ID',
      sortable: true,
      value: 'id',
      align: 'left',
    },
    {
      text: 'Email',
      sortable: true,
      value: 'email',
      align: 'left',
    },
    {
      text: 'Firstname',
      sortable: true,
      value: 'firstname',
      align: 'left',
    },
    {
      text: 'Is Active',
      sortable: true,
      value: 'is_active',
      align: 'center',
    },
    {
      text: 'Is Superuser',
      sortable: true,
      value: 'is_superuser',
      align: 'center',
    },
    {
      text: 'Actions',
      sortable: false,
      value: 'actions',
      align: 'center',
    },
  ];
  public deleteUserId;
  public deleteUserDialog = false;

  get users() {
    return readAdminUsers(this.$store);
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }

  public showDeleteDialog(item) {
      this.deleteUserId = item;
      this.deleteUserDialog = !this.deleteUserDialog;
  }

  public async deleteUser() {
      await dispatchRemoveUser(this.$store, this.deleteUserId);
      await dispatchGetUsers(this.$store);
      this.deleteUserDialog = !this.deleteUserDialog;
      delete this.deleteUserId;
  }
}
</script>
