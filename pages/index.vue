
<template>
  <div class="login">
      <v-dialog v-model="emailPrompt" max-width="481">
        <v-card>
            <v-card-title class="text-h5">
                Please enter your User ID to reset your password
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <span class="text text--secondary-style text--bold">User ID</span>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field :rules="[rules.emailRules]" v-model="emailId" outlined placeholder="Email" dense></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn color="#056694" text @click="emailPrompt = false">
                    <span class="text text--bold text--blue">Cancel</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary"  @click="confirmSend">
                    <span class="text text--bold text--white">Confirm</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="sucessDialog" max-width="481">
      <v-card>
        <v-card-title class="text-h5">
          Password Reset Email Sent
        </v-card-title>
        <v-card-text>
          An email has been sent to your resue email address. Follow the directions in the email to reset your password. 
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#056694" text @click="sucessDialog = false">
                <span class="text text--bold text--blue">Done</span>
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div>
      <div class="login__title">Welcome to Defective Signboards Diagnostic System</div>
      <div class="login__subtitle">by Buildings Department</div>
      <div class="align-self-stretch">
        <v-text-field
          label="User ID"
          outlined
          clearable
          autofocus
          v-model="username"
          dense
        ></v-text-field>
        <v-text-field
          label="Password"
          outlined
          clearable
          v-model="password"
          type="password"
          dense
        ></v-text-field>
      </div>
      <div class="login__forget-password">
        <a
          class="body-2"
          @click="emailPrompt = true"
          title="Forget Password?"
        >
          Forget Password?
        </a>
      </div>
      <v-checkbox
        v-model="rememberMe"
        label="Remember Me"
        color="primary"
        class="align-self-start"
        hide-details
      ></v-checkbox>
      <div class="login__error-msg-text">{{ errorMessage }}</div>
      <div class="login__sign-in">
        <v-btn
          color="primary"
          nuxt
          @click="login"
        >
          Sign In
        </v-btn>
      </div>
    </div>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import {mapActions} from 'vuex';

export default {
  layout: 'default-no-menu',
  middleware: 'loggedIn',
  data () {
    return {
      username: "",
      password: "",
      rememberMe: false,
      rules: {
        emailRules: (v) => v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      },
      emailId: "",
      emailPrompt: false,
      sucessDialog: false,
      isLoading: false
    }
  },
  methods: {
    ...mapActions({
      loginAction: 'user/login',
      forgetPasswordAction: "user/forgetPasswordAction"
    }),
    async confirmSend() {
        this.emailPrompt = false;
        await this.forgetPasswordAction({ staffId: this.emailId});
        this.sucessDialog = true;
    },
    async login() {
      this.isLoading = true;
      await this.loginAction({ login: this.username, password: this.password, rememberMe: this.rememberMe })
      this.isLoading = false;
    }
  },
  computed: {
    errorMessage () {
      return this.$store.state.user.errorMsg;
    }
  }
}
</script>
