<template>
    <div class="support">
        <h1>Ask Your Questions</h1>
        <h3>
            We will send you an email within 24 hours
        </h3>
        <div style="padding: 147px;">
            <v-container>
                <v-row>
                    <v-col>
                        <div>
                            Name
                        </div>
                        <div>
                            <v-text-field outlined placeholder="e.g. Peter LEE" v-model='name'></v-text-field>
                        </div>
                    </v-col>
                    <v-col>
                        <div>
                            Email Address
                        </div>
                        <div>
                            <v-text-field outlined placeholder="e.g. example@example.com" v-model='email'></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols='12'>
                        <div>
                            Please add a topic that best describes your question or comment:
                        </div>
                        <v-text-field outlined placeholder="e.g. Account support" v-model='topic'></v-text-field>
                    </v-col>
                    <v-col cols='12'>
                        <div>
                            How can we help?
                        </div>
                        <v-textarea outlined v-model='message'></v-textarea>
                    </v-col>
                    <v-col cols='12'>
                        <div style="display: flex; justify-content: flex-end;">
                            <v-btn color="primary" @click='onSubmit' style='width: 156px;'>Submit</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <v-dialog
            v-model="response"
            max-width="481"
        >
            <v-card>
                <v-card-title>
                    Submitted Query
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#056694" text @click="response = false">
                        <span class="text text--bold text--blue">Done</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import {mapActions} from 'vuex';

export default {
    data() {
        return {
            name: '',
            email: '',
            topic: '',
            message: '',
            response: false
        }
    },
    methods: {
        ...mapActions({
            sendEnquiry: 'user/sendEnquiry'
        }),
        async onSubmit () {
            await this.sendEnquiry({
                name: this.name,
                email: this.email,
                topic: this.topic,
                message: this.message
            });

            this.response = true;
        }
    }
}
</script>