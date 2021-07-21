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
                <v-subheader>Binance</v-subheader>
              </v-row>
              <v-row>
                <v-text-field
                  label="Binance API Key"
                  v-model="binanceApiKey"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  label="Binance API Secret"
                  v-model="binanceApiSecret"
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
import { IBinanceAccount, IBinanceAccountCreate, IBinanceAccountUpdate } from '@/interfaces';
import { readUserProfile, readBinanceAccount } from '@/store/main/getters';
import { dispatchGetBinanceAccount } from '@/store/main/actions';
import { dispatchCreateBinanceAccount, dispatchUpdateBinanceAccount } from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';


@Component@Component({
  components: {
  },
})
export default class BinanceAccountCreateOrEdit extends Vue {
  public title: string = 'Add a Binance account';
  public valid = true;

  public binanceAccountId: string | null = null;
  public userId: string = '';

  public binanceApiKey: string = '';
  public binanceApiSecret: string = '';

  private editMode = false;

  public async mounted() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.userId = userProfile.id;
    }
    this.editMode = this.$router.currentRoute.name === 'main-binance-accounts-edit' ? true : false;
    if (this.editMode) {
      this.title = 'Edit the bot';
      this.binanceAccountId = this.$router.currentRoute.params.id;
      await dispatchGetBinanceAccount(this.$store, this.binanceAccountId);
      this.setFormValues();
    }
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get binanceAccount() {
    return readBinanceAccount(this.$store);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as any).validate()) {
      if (this.editMode) {
        const updatedBinanceAccount: IBinanceAccountUpdate = {
          id: this.binanceAccount.id,
          binance_api_key: this.binanceApiKey,
          binance_api_secret: this.binanceApiSecret,
        };
        await dispatchUpdateBinanceAccount(this.$store, updatedBinanceAccount);
      } else {
        const createdBinanceAccount: IBinanceAccountCreate = {
          binance_api_key: this.binanceApiKey,
          binance_api_secret: this.binanceApiSecret,
        };
        await dispatchCreateBinanceAccount(this.$store, createdBinanceAccount);
      }

      this.$router.push('/main/binance/accounts');
    }
  }

  private setFormValues() {
    const binanceAccount: IBinanceAccountCreate = {
      binance_api_key: '',
      binance_api_secret: '',
    };
    this.binanceApiKey = binanceAccount.binance_api_key || '';
    this.binanceApiSecret = binanceAccount.binance_api_secret || '';
  }
}

</script>

<style>
</style>
