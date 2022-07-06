<template>
  <div class="settings-user-tab">
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-dialog v-model="newUserDialog" max-width="481">
            <v-card class="pa-4">
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title class="text-h6 mb-2">
                  Add User
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row align="center">
                      <v-col cols="5" class="mb-5"> 
                        <span class="text--bold">User ID</span>
                      </v-col>
                      <v-col cols="7" class="py-0">
                        <v-text-field v-model="newEmail" placeholder="Email" outlined dense :rules="[rules.required, rules.email]" class="settings-user-tab__field-text"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="5" class="mb-5">
                        <span class="text--bold">Password</span>
                      </v-col>
                      <v-col cols="7" class="py-0">
                        <v-text-field v-model="password" :rules="[rules.required, rules.min]" placeholder="8-characters" outlined dense class="settings-user-tab__field-text"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="5" class="mb-5">
                        <span class="text--bold">Confirm Password</span>
                      </v-col>
                      <v-col cols="7" class="py-0">
                        <v-text-field v-model="newPassword" :rules="[rules.required, passwordConfirmationRule]" placeholder="8-characters" outlined dense class="settings-user-tab__field-text"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="5" class="mb-5">
                        <span class="text--bold">Post</span>
                      </v-col>
                      <v-col cols="7" class="py-0">
                        <v-text-field v-model="newPost" placeholder="Fill in post" outlined dense :rules="[rules.required]" class="settings-user-tab__field-text"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="5" class="mb-5">
                        <span class="text--bold">Role</span>
                      </v-col>
                      <v-col cols="7" class="py-0">
                        <v-select outlined dense :items="items" item-text="text" item-value="value" v-model="newRole" :rules="[rules.required]" label="Select Role" solo></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="#056694" text @click="resetNewUser">
                    <span class="text text--bold text--blue">Cancel</span>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="#056694" text @click="addNewUser">
                    <span class="text text--bold text--blue">Save</span>
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="deleteDialog" max-width="481">
            <v-card class="pa-4">
              <v-card-title class="text-h5 justify-center mb-5">
                Confirm Delete Account
              </v-card-title>
              <v-card-actions>
                <v-btn color="#056694" text @click="deleteDialog = false">
                  <span class="text text--bold text--blue">Cancel</span>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary"  @click="onDeleteUser">
                  <span class="text text--bold text--white">Yes</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div
            class="settings-user-tab__text"
          >
            Users
          </div>
          <div class="space-above">
            <v-card elevation="0" outlined :loading="isLoading.cardUser">
              <v-container>
                <v-row>
                  <v-col class="px-6">
                    Current User
                  </v-col>
                </v-row>
                <v-row :class="{ 'settings-user-tab__selected-user': isCurrentUser}" class="settings-user-tab__user-item" :disabled="isEditing">
                  <v-col class="pl-10 pr-6" @click="onSelect(currentUser)">
                    <div class="text text--secondary-style text--bold text--medium text--black">{{ staffId }}</div>
                    <div>{{ userRole }}</div>
                  </v-col>
                </v-row>
                <template v-if="userRole !== 'Standard' ">
                  <v-row>
                  <v-col class="px-6">
                    Other User(s)
                  </v-col>
                </v-row>
                <v-row v-for="user in allUsers" :key="user.staffId">
                  <v-col
                    @click="onSelect(user)"
                    :disabled="isEditing"
                    class="pl-10 pr-6 settings-user-tab__user-item"
                    :class="{ 'settings-user-tab__selected-user': generalInfo.staffId === user.staffId && !isCurrentUser }"
                  >
                      <div class="text text--secondary-style text--bold text--medium text--black">{{ user.staffId }}</div>
                      <div>{{ USER_ROLE_NAME[user.role] }}</div>
                  </v-col>
                </v-row>
                </template>
              </v-container>
            </v-card>
            <div class='settings-user-tab__button-container' v-if="userRole !== 'Standard' ">
              <v-btn color='white' style="margin-right: 20px;" @click="newUserDialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn color='white' @click="deleteDialog = true">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="8">
          <div
            class="settings-user-tab__text"
          >
            General Information
          </div>
          <div class="space-above">
            <v-card elevation="0" outlined :loading="isLoading.cardUser">
              <v-container class="pa-8">
                <template v-if="!isEditing">
                  <div class="settings-user-tab__edit-btn">
                    <v-btn @click="onUserEdit" color="white" elevation="0" :ripple="false">
                      <span class="text text--bold text--blue">Edit</span>
                    </v-btn>
                  </div>
                </template>
                <v-row justify="space-between">
                  <v-col cols="6">
                    <v-row>
                      <v-col cols="3">
                        User ID
                      </v-col>
                      <v-col cols="7">
                        <div class="text text--secondary-style text--bold text--medium text--black">{{ generalInfo.staffId }}</div>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="3">
                        Role
                      </v-col>
                      <v-col cols="7" :class="{ 'py-0': isEditing }">
                        <div
                          v-if="!isEditing || userRole === 'Standard'"
                          class="text text--secondary-style text--bold text--medium text--black text-capitalize"
                        >
                          {{ generalInfo.role }}
                        </div>
                        <template v-else-if="isEditing && userRole !== 'Standard'">
                          <v-select
                            :items="items"
                            dense
                            outlined
                            hide-details=""
                            item-text="text"
                            item-value="value"
                            v-model="currentUserRole"
                            class="text--medium"
                            
                          ></v-select>
                        </template>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="3">
                        Post
                      </v-col>
                      <v-col cols="7" :class="{ 'py-0': isEditing }">
                        <template v-if="!isEditing || userRole === 'Standard'">
                          <div v-if="generalInfo.post" class="text text--secondary-style text--bold text--medium text--black">
                            {{ generalInfo.post }}
                          </div>
                          <div v-else class="text text--secondary-style text--bold text--medium text--black">
                            *empty*
                          </div>
                        </template>
                        <template v-else-if="isEditing && userRole !== 'Standard'">
                          <v-text-field outlined dense hide-details v-model="currentPost" placeholder="Add Post" class="settings-user-tab__field-text" />
                        </template>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="6">
                    <v-row align="center">
                      <v-col cols="4">
                        Chinese Name
                      </v-col>
                      <v-col cols="7" :class="{ 'py-0': isEditing }">
                        <template v-if="!isEditing">
                          <div v-if="generalInfo.chineseName" class="text text--secondary-style text--bold text--medium text--black">
                            {{ generalInfo.chineseName }}
                          </div>
                          <div v-else class="text text--secondary-style text--bold text--medium text--black">
                            *empty*
                          </div>
                        </template>
                        <template v-else>
                          <v-text-field outlined dense hide-details v-model="currentChName" placeholder="Add Chinese Name" class="settings-user-tab__field-text" />
                        </template>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="4">
                        English Name
                      </v-col>
                      <v-col cols="7" :class="{ 'py-0': isEditing }">
                        <template v-if="!isEditing">
                          <div v-if="generalInfo.englishName" class="text text--secondary-style text--bold text--medium text--black">
                            {{ generalInfo.englishName }}
                          </div>
                          <div v-else class="text text--secondary-style text--bold text--medium text--black">
                            *empty*
                          </div>
                        </template>
                        <template template v-else>
                          <v-text-field outlined dense hide-details v-model="currentEngName" placeholder="Add English Name" class="settings-user-tab__field-text" />
                        </template>
                      </v-col>
                    </v-row>
                    <v-row align="center">
                      <v-col cols="4">
                        Office Phone Number
                      </v-col>
                      <v-col cols="7" :class="{ 'py-0': isEditing }">
                        <template v-if="!isEditing">
                          <div v-if="generalInfo.phoneNumber" class="text text--secondary-style text--bold text--medium text--black">
                            {{ generalInfo.phoneNumber }}
                          </div>
                          <div v-else class="text text--secondary-style text--bold text--medium text--black"> 
                            *empty*
                          </div>
                        </template>
                        <template template v-else>
                          <v-text-field outlined dense hide-details v-model="currentPhoneNumb" placeholder="Add Phone Number" class="settings-user-tab__field-text" />
                        </template>
                      </v-col>
                    </v-row>
                    <v-row align="center" v-if="isCurrentUser">
                      <v-col cols="4">
                        Password
                      </v-col>
                      <v-col cols="6">
                        <template v-if="!isEditing">
                          <div class="text text--secondary-style text--bold text--medium text--black">
                            *******
                          </div>
                        </template>
                        <template v-if="isEditing">
                          <v-btn 
                                  color="white"
                                  text 
                                  class="px-0"
                                  @click="confirmResetPassword"
                                >
                                  <span class="text text--bold text--blue">Change Password</span>
                                </v-btn>
                        </template>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
            <v-row  v-if="isEditing" justify="end" class="mt-5 mr-1">
              <v-btn @click="isEditing = false" elevation="0" color="white" :ripple="false" class="mr-4"><span class="text text--bold text--blue">Cancel</span></v-btn>
              <v-btn color="primary" elevation="0" @click="saveEditedUser"><span class="text text--bold text--white">Save</span></v-btn>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="changePasswordDialog" max-width="481">
      <v-card class="pa-4">
        <v-card-title class="text-h5 mb-2">
          <v-row>
            <v-col cols="1">
              <v-icon color="#7ED321">
                mdi-checkbox-marked-circle
              </v-icon>
            </v-col>
            <v-col cols="11">
              Password Reset Email Sent
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="11">
              An email has been sent to your rescue email address. 
              <br/>Follow the directions in the email to reset your password.
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" text @click="changePasswordDialog = false">
            <span class="text text--bold text--blue">Done</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="isLoading.overlay">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar top color="#056694" elevation="20" v-model="isLoading.isFinish">
      <h3 class="text text--white">{{ isLoading.message }}</h3>
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="isLoading.isFinish = false">
            Close
          </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import {mapActions} from 'vuex';
import {USER_ROLE, USER_ROLE_NAME, ROLES} from '../../constants';

export default {

  data() {
    return {
      generalInfo: {},
      isEditing: false,
      newUserDialog: false,
      newEmail: "",
      newRole: "",
      newPassword: "",
      password: "",
      newPost: "",
      deleteDialog: false,
      changePasswordDialog: false,
      USER_ROLE_NAME,
      items : ROLES,
      rules: {
        required: value => !!value || "Required.",
        min: v => (v && v.length >= 8)  || "Min 8 characters",
        email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      },
      isLoading: {
        overlay: false,
        cardUser: false,
        isFinish: false,
        message: ""
      },
      currentChName: "",
      currentUserRole: "",
      currentPost: "",
      currentEngName: "",
      currentPost: "",
      currentPhoneNumb: "",
      currentUserId: "",
      currentStaffId: "",
      isCurrentUser: false,
      valid: false,
      indexSelected: 0,
    }
  },
  async mounted () {
    this.isLoading.cardUser = true;

    await this.getUserInfo(window.localStorage.getItem("userId"));
    this.setGeneralInfo(this.currentUser);

    if (this.userRole !== 'Standard') {
      await this.getAllUsers(window.localStorage.getItem("userId"));
    }

    this.isLoading.cardUser = false;
  },
  computed: {
    staffId() {
      return this.$store.state.user.staffId
    },
    userRole() {
      return USER_ROLE_NAME[this.$store.state.user.userRole];
    },
    allUsers() {
      if (this.userRole !== 'Standard') {
        return this.$store.state.user.allUsers.filter((user) => user.userId !== window.localStorage.getItem("userId"));
      }
      else {
        return null;
      }
    },
    currentUser() {
      return this.$store.state.user.currUser;
    },
    loginRole() {
      return this.$store.state.user.userRole;
    },
    passwordConfirmationRule() {
      return this.password === this.newPassword || "Password must match";
    }
  },
  methods: {
    ...mapActions({
      getUserInfo: "user/getUserInfo",
      getAllUsers: "user/getAllUsers",
      saveUserRole: "user/saveUserRole",
      saveUserEditedData: "user/saveUserEditedData",
      createUser: "user/createUser",
      removeUser: "user/removeUser",
      forgetPasswordAction: "user/forgetPasswordAction"
    }),
    onSelect(user) {
      if (!this.isEditing) {
        this.setGeneralInfo(user);
      }
    },
    setGeneralInfo(user) {
      this.generalInfo = {...user};
      if (this.staffId !== this.generalInfo.staffId) {
        this.isCurrentUser = false
        this.indexSelected = this.allUsers.indexOf(user);
      }
      else {
        this.isCurrentUser = true;
      }
    },
    onUserEdit() {
      this.isEditing = true;
      this.currentUserId = this.generalInfo.userId;
      this.currentStaffId = this.generalInfo.staffId;
      this.currentEngName = this.generalInfo.englishName;
      this.currentPhoneNumb = this.generalInfo.phoneNumber;
      this.currentChName = this.generalInfo.chineseName;
      this.currentPost = this.generalInfo.post;
      this.currentUserRole = this.generalInfo.role;
    },
    async saveEditedUser() {
      this.isLoading.overlay = true;
      await this.saveUserEditedData({
        newUserType: this.currentUserRole,
        userId: this.currentUserId,
        newPost: this.currentPost,
        newChineseName: this.currentChName,
        newEnglishName: this.currentEngName,
        newPhoneNumber: this.currentPhoneNumb,
        isUser: this.isCurrentUser
      });
      this.isEditing = false;
      this.processFinished({message: "Update Successful"});                                                                  
    },
    async addNewUser() {
      await this.$refs.form.validate();
      if (this.valid === true) {
        this.newUserDialog = false;
        this.isLoading.overlay = true;
        await this.createUser({
          staffId: this.newEmail,
          password: this.newPassword,
          role: this.newRole,
          post: this.newPost
        });
        this.$refs.form.reset();
        this.processFinished({message: "Save Successful"});
      }
    },
    resetNewUser() {
      this.newUserDialog = false;
      this.$refs.form.reset();
    },
    async onDeleteUser() {
      this.deleteDialog = false;
      this.isLoading.overlay = true;
      await this.removeUser({
        userId: this.generalInfo.staffId
      });
      this.processFinished({message: "Delete Successful"});
    },
    processFinished({ message }) {
      this.isLoading.overlay = false;
      this.isLoading.isFinish = true;
      this.isLoading.message = message; 
    },
    async confirmResetPassword() {
      this.isLoading.overlay = true;
      await this.forgetPasswordAction({ staffId: this.currentStaffId});
      this.isLoading.overlay = false;
      this.changePasswordDialog = true;
    },
  },
  watch : {
    allUsers() {
      if (this.isCurrentUser === false) {
        this.setGeneralInfo(this.allUsers[this.indexSelected]);
      }
    },
    currentUser() {
      this.setGeneralInfo(this.currentUser);
    }
  }
}
</script>