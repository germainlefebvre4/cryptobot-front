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
                <v-subheader>Margin Currency</v-subheader>
              </v-row>
              <v-row>
                <v-text-field
                  label="Base currency"
                  v-model="baseCurrency"
                ></v-text-field>
                  </v-row>
                  <v-row>
                <v-text-field
                  label="Quote currency"
                  v-model="quoteCurrency"
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
import { ICurrency, ICurrencyCreate, ICurrencyDelete } from '@/interfaces';
import { readUserProfile, readMarginCurrency, readMarginCurrencies } from '@/store/main/getters';
import {
    dispatchGetMarginCurrencies,
    dispatchCreateMarginCurrency,
} from '@/store/main/actions';
import { Dictionary } from 'vue-router/types/router';


@Component@Component({
  components: {
  },
})
export default class MarginCurrencyCreateOrEdit extends Vue {
  public title: string = 'Add a currency';
  public valid = true;

  public marginCurrencyId: string | null = null;
  public userId: string = '';

  public baseCurrency: string = '';
  public quoteCurrency: string = '';

  private editMode = false;

  public async mounted() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.userId = userProfile.id;
    }
    // this.editMode = this.$router.currentRoute.name === 'main-binance-accounts-edit' ? true : false;
    // if (this.editMode) {
    //   this.title = 'Edit the bot';
    //   this.marginCurrencyId = this.$router.currentRoute.params.id;
    //   await dispatchGetMarginCurrency(this.$store, this.marginCurrencyId);
    //   this.setFormValues();
    // }
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get marginCurrency() {
    return readMarginCurrency(this.$store);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as any).validate()) {
      if (this.editMode) {
        // const updatedMarginCurrency: ICurrencyUpdate = {
        //   id: this.marginCurrency.id,
        //   base_currency: this.baseCurrency,
        //   quote_currency: this.quoteCurrency,
        // };
        // await dispatchUpdateMarginCurrency(this.$store, updatedMarginCurrency);
      } else {
        const createdMarginCurrency: ICurrency = {
          base_currency: this.baseCurrency,
          quote_currency: this.quoteCurrency,
        };
        await dispatchCreateMarginCurrency(this.$store, createdMarginCurrency);
      }

      this.$router.push('/main/margin');
    }
  }

  private setFormValues() {
    const marginCurrency: ICurrency = {
      base_currency: '',
      quote_currency: '',
    };
    this.baseCurrency = marginCurrency.base_currency || '';
    this.quoteCurrency = marginCurrency.quote_currency || '';
  }
}

</script>

<style>
</style>
