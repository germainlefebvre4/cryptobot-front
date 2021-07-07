<template>
  <v-container fluid>
    <v-card class="ma-3 pa-3">
      <v-card-title primary-title>
        <div class="headline primary--text">Accueil</div>
      </v-card-title>
      <v-card-text>
        <div class="headline font-weight-light ma-5">Bienvenue {{ greetedUser }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn to="/main/profile/view">Voir le profil</v-btn>
        <v-btn to="/main/profile/edit">Modifier le profil</v-btn>
        <v-btn to="/main/profile/password">Modifier le mot de passe</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Store } from 'vuex';
import { readUserProfile } from '@/store/main/getters';

@Component
export default class Dashboard extends Vue {
  get greetedUser() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      if (userProfile.firstname) {
        return userProfile.firstname;
      } else {
        return userProfile.email;
      }
    }
  }
}
</script>
