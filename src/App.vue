<template>
  <div id="app">
    <v-app>
      <v-main v-if="loggedIn===null">
        <v-container fill-height fluid>
          <v-layout align-center justify-center>
            <v-flex>
              <div class="text-xs-center" style="text-align:center;">
                <div class="headline my-5">Chargement...</div>
                <v-progress-circular size="100" indeterminate color="primary"></v-progress-circular>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-main>
      <router-view v-else />
      <NotificationsManager></NotificationsManager>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NotificationsManager from '@/components/NotificationsManager.vue';
import { readIsLoggedIn } from '@/store/main/getters';
import { dispatchCheckLoggedIn } from '@/store/main/actions';

@Component({
  components: {
    NotificationsManager,
  },
})
export default class App extends Vue {

  get loggedIn() {
    return readIsLoggedIn(this.$store);
  }

  public async created() {
    await dispatchCheckLoggedIn(this.$store);
  }
}
</script>
