<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Create an account</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @keyup.enter="registerCheck">
                <div class="form_field">
                  <v-text-field
                    v-model="firstname"
                    prepend-icon="mdi-account"
                    name="firstname"
                    label="Votre prénom"
                    type="text"></v-text-field>
                  <small class="field_error" v-if="formErrors.includes('firstnameEmpty')">Ce champ est obligatoire</small>
                </div>
                <div class="form_field">
                  <v-text-field
                    v-model="email"
                    prepend-icon="mdi-email"
                    name="login"
                    label="Votre adresse e-mail"
                    type="text"></v-text-field>
                  <small class="field_error" v-if="formErrors.includes('emailEmpty')">Ce champ est obligatoire</small>
                  <small class="field_error" v-if="formErrors.includes('emailBadFormatted')">Votre email ne correspond pas à une adresse e-mail valide</small>
                </div>
                <div class="form_field">
                  <v-text-field
                    v-model="password"
                    prepend-icon="mdi-lock"
                    name="password"
                    label="Votre mot de passe"
                    type="password"></v-text-field>
                  <small class="field_error" v-if="formErrors.includes('passwordEmpty')">Ce champ est obligatoire</small>
                </div>
                <div class="form_field">
                  <v-checkbox
                    v-model="cgu"
                  >
                    <template v-slot:label>
                      <div>
                        J'accpète les <a
                          target="_blank"
                          href="http://google.fr"
                          @click.stop
                        >
                          CGU
                        </a>
                      </div>
                    </template>
                  </v-checkbox>
                  <small class="field_error" v-if="formErrors.includes('cguFalsy')">Vous devez accèpter les CGU</small>
                </div>
              </v-form>
              <div v-if="registerError">
                <v-alert :value="registerError" transition="fade-transition" type="error">
                  Une erreur est survenue lors de la création de votre compte.
                </v-alert>
              </div>
              <v-flex class="caption text-xs-right"></v-flex>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click.prevent="registerCheck">S'inscrire</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { dispatchCreateUser } from '@/store/admin/actions';
import { dispatchRegister } from '@/store/register/actions';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class RegisterPage extends Vue {
  public firstname: string = '';
  public email: string = '';
  public password: string = '';
  public cgu: boolean = false;
  public registerError: boolean = false;
  public formErrors: string[] = [];

  public registerCheck() {
    this.formErrors = [];

    // Check if fisrtname is Empty
    if (this.isEmpty(this.firstname)) {
      this.formErrors = [...this.formErrors, 'firstnameEmpty'];
    }

    // Check if email is Empty
    if (this.isEmpty(this.email)) {
      this.formErrors = [...this.formErrors, 'emailEmpty'];
    }

    // Check if email is valid
    if (!this.isEmpty(this.email) && !this.isValidEmail(this.email)) {
      this.formErrors = [...this.formErrors, 'emailBadFormatted'];
    }

    // Check if password is Empty
    if (this.isEmpty(this.password)) {
      this.formErrors = [...this.formErrors, 'passwordEmpty'];
    }

    // Check if cgu is falsy
    if (this.isFalsy(this.cgu)) {
      this.formErrors = [...this.formErrors, 'cguFalsy'];
    }

    if (this.isValidForm()) {
      this.register();
    }
  }

  /**
   * Method to check if input vlaue is empty
   *
   * value string
   * return boolean
   */
  private isEmpty(value) {
    return value.trim() === '';
  }

  /**
   * Method to check if input value is false
   *
   * value string
   * return boolean
   */
  private isFalsy(value) {
    return value === false;
  }

  /**
   * Method to check if email value is valid
   *
   * value string
   * return boolean
   */
  private isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  /**
   * Method to check if form contains errors
   *
   * value string
   * return boolean
   */
  private isValidForm() {
    return this.formErrors.length === 0;
  }

  /**
   * Method to register new user
   *
   * return void
   */
  private register() {
    const newUser = {
      firstname: this.firstname,
      email: this.email,
      password: this.password,
    };

    dispatchRegister(this.$store, newUser);
  }
}
</script>

<style scoped>
.form_field {
  position: relative;
}

.field_error {
  position: absolute;
  bottom: 0;
  right: 0;
  color: red;
}
</style>
