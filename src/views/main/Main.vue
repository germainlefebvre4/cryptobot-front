<template>
  <div>
    <v-navigation-drawer persistent :mini-variant="miniDrawer" v-model="showDrawer" fixed app>
      <v-layout column fill-height>

        <v-list subheader>
          <v-subheader>Binance Accounts</v-subheader>
          <v-list-item to="/main/binance/accounts/view">
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>List accounts</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/main/binance/accounts/create">
            <v-list-item-action>
              <v-icon>mdi-pen</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Add an account</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list subheader>
          <v-subheader>Telegram Channels</v-subheader>
          <v-list-item to="/main/telegrams/view">
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>List channels</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/main/telegrams/create">
            <v-list-item-action>
              <v-icon>mdi-pen</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Add a channel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list subheader>
          <v-subheader>Bots</v-subheader>
          <v-list-item to="/main/cryptobots/view">
            <v-list-item-action>
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Manage bots</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/main/cryptobots/create">
            <v-list-item-action>
              <v-icon>mdi-pen</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Create a bot</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list subheader v-show="hasAdminAccess">
          <v-subheader>Administration</v-subheader>
          <v-list-item to="/main/admin/users/all">
            <v-list-item-action>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Manage users</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/main/admin/users/create">
            <v-list-item-action>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Create a user</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-spacer></v-spacer>
        <v-list>
          <v-list-item to="/main/profile/view">
            <v-list-item-action>
              <v-icon>mdi-account</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>My account</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-exit-run</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="switchMiniDrawer">
            <v-list-item-action>
              <v-icon v-html="miniDrawer ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Reduce</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-navigation-drawer>
    <v-app-bar dark color="primary" app>
      <v-app-bar-nav-icon @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-text="appName"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu bottom left offset-y>
        <v-btn slot:activator="{ on }" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-item to="/main/profile">
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>person</v-icon>
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>close</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import { appName } from '@/env';
import { readDashboardMiniDrawer, readDashboardShowDrawer, readHasAdminAccess, readUserProfile } from '@/store/main/getters';
import { commitSetDashboardShowDrawer, commitSetDashboardMiniDrawer } from '@/store/main/mutations';
import { dispatchUserLogOut } from '@/store/main/actions';
import UserProfile from './profile/UserProfile.vue';

const routeGuardMain = async (to, from, next) => {
  if (to.path === '/main') {
    next('/main/profile');
  } else {
    next();
  }
};

@Component
export default class Main extends Vue {
  public appName = appName;
  public avatarSize = 0;

  public beforeRouteEnter(to, from, next) {
    routeGuardMain(to, from, next);
  }

  public beforeRouteUpdate(to, from, next) {
    routeGuardMain(to, from, next);
  }

  get miniDrawer() {
    return readDashboardMiniDrawer(this.$store);
  }

  get showDrawer() {
    return readDashboardShowDrawer(this.$store);
  }

  set showDrawer(value) {
    commitSetDashboardShowDrawer(this.$store, value);
  }

  public switchShowDrawer() {
    commitSetDashboardShowDrawer(
      this.$store,
      !readDashboardShowDrawer(this.$store),
    );
  }

  public switchMiniDrawer() {
    const isMiniDrawer = readDashboardMiniDrawer(this.$store);

    // Resize Avatar
    if (isMiniDrawer) {
      this.avatarSize = 60;
    } else {
      this.avatarSize = 28;
    }

    // Switch MiniDrawer size
    commitSetDashboardMiniDrawer(
      this.$store,
      !isMiniDrawer,
    );
  }

  public get hasAdminAccess() {
    return readHasAdminAccess(this.$store);
  }

  public async logout() {
    await dispatchUserLogOut(this.$store);
  }

  public created() {
    const userProfile = readUserProfile(this.$store);
    this.avatarSize = 60;
  }

  get userProfile() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile && ! userProfile.hasOwnProperty('avatar')) {
      userProfile.avatar = 'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png';
    }
    return userProfile;
  }

}
</script>
