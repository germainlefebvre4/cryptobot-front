<template>
  <v-container ma-0 pa-0>
    <v-card>
      <v-card-title primary-title>
        <div class="headline primary--text">{{ title }}</div>
      </v-card-title>
      <v-card-text>
        <template>

          <v-form v-model="valid" ref="form" lazy-validation>

            <v-container>
              <v-row>
                <v-subheader>Telegram channel</v-subheader>
              </v-row>
              <v-row>
                <v-text-field
                  label="Telegram Client ID"
                  v-model="clientId"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  label="Telegram Token"
                  v-model="token"
                ></v-text-field>
              </v-row>
            </v-container>
            
          </v-form>
          
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn
          @click="submit"
          :disabled="!valid"
        >
          {{ editMode ? 'Save' : 'Add'}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Store } from 'vuex';
import { ITelegram, ITelegramCreate, ITelegramUpdate } from '@/interfaces';
import { readUserProfile, readTelegram } from '@/store/main/getters';
import { dispatchGetTelegram } from '@/store/main/actions';
import { dispatchCreateTelegram, dispatchUpdateTelegram } from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';


@Component@Component({
  components: {
  },
})
export default class TelegramCreateOrEdit extends Vue {
  public title: string = 'Add a Binance account';
  public valid = true;

  public telegramId: string | null = null;
  public userId: string = '';

  public clientId: string = '';
  public token: string = '';

  private editMode = false;

  public async mounted() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.userId = userProfile.id;
    }
    this.editMode = this.$router.currentRoute.name === 'main-binance-accounts-edit' ? true : false;
    if (this.editMode) {
      this.title = 'Edit the bot';
      this.telegramId = this.$router.currentRoute.params.id;
      await dispatchGetTelegram(this.$store, this.telegramId);
      this.setFormValues();
    }
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get telegram() {
    return readTelegram(this.$store);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as any).validate()) {
      if (this.editMode) {
        const updatedTelegram: ITelegramUpdate = {
          id: this.telegram.id,
          client_id: this.clientId,
          token: this.token,
        };
        await dispatchUpdateTelegram(this.$store, updatedTelegram);
      } else {
        const createdTelegram: ITelegramCreate = {
          client_id: this.clientId,
          token: this.token,
        };
        await dispatchCreateTelegram(this.$store, createdTelegram);
      }

      this.$router.push('/main/telegrams');
    }
  }

  private setFormValues() {
    const telegram: ITelegramCreate = {
      client_id: '',
      token: '',
    };
    this.clientId = telegram.client_id || '';
    this.token = telegram.token || '';
  }
}

</script>

<style>
</style>
