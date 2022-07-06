<template>
  <div class="signboard-box-info">
    <div v-if="signboardIdentificationStatus!='deleted'" :class="`signboard-box-info__box-container signboard-box-info__box-container--${defectType}`">
      <div class="signboard-box-info__text signboard-box-info__text">{{ SIGNBOARD_TYPE_NAME_MAP[defectType] }} Signboard</div>
      <div class="signboard-box-info__info-container">
        <img :src="`/signboard-${defectType}.svg`" class="signboard-box-info__image" />
        <div class="signboard-box-info__text signboard-box-info__text signboard-box-info__text--space-left">{{ signboardId }}</div>
      </div>
    </div>
    <div v-else class="signboard-box-info__box-container signboard-box-info__box-container">
      <div class="signboard-box-info__text signboard-box-info__text">Not Signboard</div>
      <div class="signboard-box-info__info-container">
        <img :src="`/signboard-${defectType}.svg`" class="signboard-box-info__image" />
        <div class="signboard-box-info__text signboard-box-info__text signboard-box-info__text--space-left">{{ signboardId }}</div>
      </div>
    </div>
    <v-dialog v-model="confirmDeleteDialog" persistent max-width="481">
      <v-card>
        <v-card-title class="text-h6">
          Are you sure want to delete this signboard?
        </v-card-title>
        <v-card-actions>
          <v-btn text @click="confirmDeleteDialog = false">
            <span class="text text--bold text--blue">Cancel</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteSignboard">
            <span class="text text--bold text--white">Confirm</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="record-list__export-container">
      <v-btn
          v-if="signboardIdentificationStatus!='deleted'"
          color="white"
          style="width:100px;"
          solo
          elevation="0"
          :ripple="false"
          @click="confirmDeleteDialog = true">
          <span class="text text--bold text--blue">
            Delete Signboard
          </span>
        </v-btn>
    </div>
    <div class="signboard-box-info__box-container signboard-box-info__box-container">
      <div class="signboard-box-info__text">Sampling</div>
      <div :class="samplingClass">
        <span class="signboard-box-info__text signboard-box-info__text--small signboard-box-info__text--white">{{samplingText}}</span></div>
    </div>
    <div class="signboard-box-info__box-container signboard-box-info__box-container">
      <div class="signboard-box-info__text">Verification</div>
        <div class="signboard-box-info__info-container">
          <template v-if="verifiedStatus">
            <span class="text text--small text--grey signboard-box-info__verified-text" v-show="verifyTextBtn !== 'Verify this signboard'">{{verifyUpdatedByNTime}}</span>
          </template>
          <div :class="computedVerifiedClass">
            <span class="signboard-box-info__text signboard-box-info__text--small signboard-box-info__text--white">{{ verifiedText }}</span>
          </div>
          <span>
            <v-tooltip
              v-model="show"
              top
              :open-on-hover="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  :ripple="false"
                >
                  <v-icon @click="show=!show">mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <span @click=" updateVerifyStatus({signboardId, verified}); (show=!show)" class="signboard-box-info__pointer-style">{{ verifyTextBtn }}</span>
            </v-tooltip>
            </span>
        </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import moment from 'moment';
import {SIGNBOARD_TYPE_NAME_MAP} from '../../constants';

export default {
  props: ["signboardId", "verified"],
  data() {
    return {
      sampledData: false,
      verification: false,
      show: false,
      SIGNBOARD_TYPE_NAME_MAP,
      confirmDeleteDialog: false,
    };
  },
  computed: {
    selectedSignboard() {
      return this.$store.state.signboard.selectedSignboard;
    },
    defectType () {
      return this.selectedSignboard.defectCount && this.selectedSignboard.signboardType === 'defective' ? "defective" : "normal"
    },
    verifiedText () {
      return this.verified ? "Verified" : "Not Verified"
    },
    verifyTextBtn () {
      return this.verified ? "Unverify this signboard" : "Verify this signboard"
    },
    verifiedStatus () {
      return this.selectedSignboard.revisionStatus ? this.selectedSignboard.revisionStatus : false
    },
    verifyUpdatedByNTime(){
      const verified = this.selectedSignboard.revisionStatus.verified;
      if(this.verifiedStatus && verified.updatedBy){
        return `Last updated by ${verified.updatedBy} on ${moment(verified.updated).format('DD-MM-yyyy')}`
      } else {
        return "";
      }
    },
    computedVerifiedClass() {
      return this.verified ? "signboard-box-info__badge" : "signboard-box-info__badge signboard-box-info__badge--grey"
    },
    samplingText(){
      return (this.selectedSignboard.sampling) ? "Sampled" : "No";
    },
    samplingClass(){
      return (this.selectedSignboard.sampling) ? "signboard-box-info__badge" : "signboard-box-info__badge signboard-box-info__badge--grey"
    },
    signboardIdentificationStatus(){
      return this.verifiedStatus.signboardIdentificationRevised.status;
    }
  },
  methods: {
    ...mapActions({
      updateVerifyStatus: "signboard/updateVerifyStatus",
      markSignboardDeleted: "signboard/markSignboardDeleted"
    }),
    ...mapMutations({
      setSignboardDetail: "signboard/setSignboardDetail",
    }),
    deleteSignboard(){
      this.markSignboardDeleted({
        signboardId: this.signboardId, 
        fromSignboardDetail: true
      });
      this.setSignboardDetail(false); 
      this.confirmDeleteDialog = false;
    },
  },
  watch: {
    signboardId() {
      this.show = false;
    }
  }
};
</script>
