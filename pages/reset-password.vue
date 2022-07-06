
<template>
    <div class="forget-password">
        <v-dialog v-model="sucessDialog" max-width="481">
            <v-card>
                <v-card-title class="text-h5">
                    {{ responseMessage }}
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#056694" text @click="backToLogin">
                        <span class="text text--bold text--blue">Done</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div>
            <div class="login__title">Reset Password</div>
            <div class="login__subtitle">Please enter a new password</div>
            <div class="align-self-stretch">
                <v-text-field
                    v-model="password"
                    :append-outer-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="New Password"
                    placeholder="At least 8 characters"
                    outlined
                    @click:append-outer="show1 = !show1"
                    :rules="[rules.required, rules.min]"
                    class="forget-password__field"
                ></v-text-field>
                <v-text-field
                    v-model="confirmPassword"
                    :append-outer-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirm New Password"
                    placeholder="Confirm New Password"
                    outlined
                    @click:append-outer="show2 = !show2"
                    :rules="[(password === confirmPassword) || 'Password must match']"
                    class="forget-password__field"
                ></v-text-field>
            </div>
            <div class="login__error-msg-text">{{ errorMessage }}</div>
            <div class="login__sign-in">
                <v-btn
                    color="primary"
                    nuxt
                    @click="resetPassword"
                >
                    Confirm
                </v-btn>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';

export default {
    layout: 'default-no-menu',
    data () {
        return {
            username: "",
            password: "",
            confirmPassword: "",
            rememberMe: false,
            show1: false,
            show2: false,
            rules: {
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters',
                emailMatch: () => (`The email and password you entered don't match`)
            },
            emailPrompt: false,
            passwordToken: "",
            sucessDialog: false,
            responseMessage: ""
        }
    },
    methods: {
        ...mapActions({
            loginAction: 'user/login',
            resetPasswordAction: 'user/resetPasswordAction'
        }),
        async resetPassword() {
            const response = await this.resetPasswordAction({
                forgotPwdToken: this.passwordToken,
                password: this.password
            });

            if(response === 500) {
                this.responseMessage = "Reset code expired"
            } else {
                this.responseMessage = 'Password reset successful!'
            }

            this.sucessDialog = true;
        },
        backToLogin() {
            this.$router.push("/");
        }
    },
    computed: {
        errorMessage () {
            return this.$store.state.user.errorMsg;
        }
    },
    mounted() {
        this.passwordToken = this.$route.query.forgotPwdToken;
    }
}
</script>
