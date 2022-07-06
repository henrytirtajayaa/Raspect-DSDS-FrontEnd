<template>
  <v-card class="dsrn-form pa-5">
    <v-dialog v-model="confirmSaveDialog" persistent max-width="481">
      <v-card>
        <v-card-title class="text-h6 text-center justify-center mb-5">
          Document save successfully.<br>
          Data in signboard view won't change.
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmSaveDialog = false">
            <span class="text text--bold text--blue">Confirm</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmLeaveDialog" persistent max-width="481">
      <v-card>
        <v-card-title class="text-h6 text-center justify-center mb-5">
          Do you want to leave without save?
        </v-card-title>
        <v-card-actions>
          <v-btn text @click="confirmLeaveDialog = false">
            <span class="text text--bold text--blue">Cancel</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeTool">
            <span class="text text--bold text--white">Leave</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card-title class="d-flex justify-space-between pr-0">
      <span>Documents Form 
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
            >mdi-information</v-icon>
          </template>
          <span class="text-center justify-center mb-5">
                All changes made here will not update the signboard details.<br>
                Any input modified here will only affect the content of documents</span>
        </v-tooltip>
      </span>
      <span><v-icon @click="confirmLeaveDialog = true">mdi-close</v-icon></span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-container class="pl-0">
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Date of Survey</span>
            </v-col>
            <v-col cols="9">
              <v-row>
                <v-col v-for="(date, index) in dateOfSurvey" :key="date.id" cols="12" md="4">
                  <v-select hide-details="auto" :label="date.title" outlined dense class="text text--small" v-model="form.dateOfSurvey[index]" :items="date.items" item-text="title" item-value="id" required :rules="[rules.required]"> </v-select>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">BD File Reference 檔案編號</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" outlined dense full-width required :rules="[rules.required]" placeholder="BD File Reference 檔案編號" v-model="form.bdFile"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Sign Address</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Sign Address" v-model="form.signAddress"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">構築物地點</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="構築物地點" v-model="form.signAddressCN"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Address of signboard owers</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Address of signboard owers" v-model="form.addressSignOwers"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">構築物擁有者住址</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="構築物擁有者住址" v-model="form.addressSignOwersCN"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">DSRN number 通知編號</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]"  outlined dense full-width placeholder="DSRN number 通知編號" v-model="form.dsrnNo"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Area Code</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Area Code" v-model="form.areaCode"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
          <v-col cols="12" md="3">
              <span class="text--bold">Account Type</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-chip-group v-model="form.accountType" active-class="selected">
                <v-chip outlined label v-for="option in signOwnerOption" :key="option.id" :value="option.title" :ripple="false">
                  <span class="text text--secondary-style">{{ option.title }}</span>
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
          <template v-if="form.accountType === 'Advance'">
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">Person on whom the DSRN to be served</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Person on whom the DSRN to be served" v-model="form.signOwer"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">擬獲送達通知的人</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="擬獲送達通知的人" v-model="form.signOwerCN"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">Name of business/company who owns the signboard</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Signboard/company name" v-model="form.signCompany"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">擁有該招牌的商戶或公司</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="擁有該招牌的商戶或公司" v-model="form.signCompanyCn"></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">Person on whom the DSRN to be served</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field disabled class='disable-input' hide-details="true" outlined dense full-width v-model="form.signOwer"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">擬獲送達通知的人</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field disabled class='disable-input' hide-details="auto" outlined dense full-width v-model="form.signOwerCN"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">Name of business/company who owns the signboard</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field disabled class='disable-input' hide-details="auto" outlined dense full-width v-model="form.signCompany"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="3">
                <span class="text--bold">擁有該招牌的商戶或公司</span>
              </v-col>
              <v-col cols="12" md="9">
                <v-text-field disabled class='disable-input' hide-details="auto" outlined dense full-width v-model="form.signCompanyCn"></v-text-field>
              </v-col>
            </v-row>
          </template>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Type of Signboard</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-chip-group v-model="form.signType" active-class="selected" column mandatory multiple>
                <v-chip outlined label v-for="option in signTypeOption" :key="option.id" :value="option.id" :ripple="false">
                  <span class="text text--secondary-style">{{ option.title }}</span>
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Type of Defects</span>
            </v-col>
            <v-col cols="12" md="9">
              <template>
                <v-chip-group v-model="form.defectType" active-class="selected" multiple mandatory>
                <template v-for="option in defectOption">
                  <v-tooltip :key="option.id" top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-chip outlined label :key="option.id" :value="option.id" v-bind="attrs" v-on="on" :ripple="false">
                        <span class="text text--secondary-style">{{ option.letterGrade }}</span>
                      </v-chip>
                    </template>
                      <span class="text--small" v-if="option">
                        <div class="text--small text--bold">
                          Defect({{option.letterGrade}})
                        </div>
                        {{option.desc}}
                      </span>
                  </v-tooltip>
                </template>
              </v-chip-group>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Record Photo</span>
            </v-col>
            <v-col cols="12" md="9"  class="annotation-tool__photo-slide-container-horizontal">
              <v-radio-group v-model="form.recordPhoto" v-for="imageElement of signImages" :key="imageElement._id" class="mr-3">
                <CommonImageAnnotationView 
                  :canvasName="`dsrnFormAngle${ imageElement._id }`"
                  label="Image Captured"
                  :createdAt="imageElement.capturedAt"
                  :width="240"
                  :height="160"
                  widthCss="240"
                  :isZoom="true"
                  :imageSrc="imageElement.highResPath"
                  :imageTitle="imageElement.filename"
                  :coordinates="imageElement.signboardAnnotation.location.coordinates[0]"
                  :fromSignboardDetail="true"
                />
                <template v-slot:prepend>
                  <v-radio :value="imageElement._id" @click="onImageClick(imageElement._id)"/>
                </template>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row>
            <v-col offset-md="3">
              <CommonAnnotationToolCompact 
                v-if="form.recordPhoto !== '' && Object.keys(chosenImageDetails).length !== 0"
                :imgSrc="imageComputed"
                :imgId="chosenImageDetails.imgId"
                :key="chosenImageDetails._id"
                :fromSignboardDetail="true"
                :signboardAnnotationList="chosenImageDetails.signboardAnnotation"
                :dsrnAnnotation="dsrnAnnotation"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Action Recommend</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-row class="ma-0">
                <v-select hide-details="auto" required :rules="[rules.required]" placeholder="Select pre-set list" outlined dense class="text text--small" v-model="form.actionRecommend" :items="actionList" @change="actionRecomWeeks = ''" item-text="text" item-value="id"></v-select>
              </v-row>
            </v-col>
          </v-row>
        <!-- ================================= -->
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Name of the Case officer 1</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required readonly :rules="[rules.required]" outlined dense full-width placeholder="Name of the Case officer" v-model="form.caseOfficer"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">負責職員 1</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="負責職員" v-model="form.caseOfficerCN"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Post of the Case officer 1</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-autocomplete hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Post of the Case officers" :items="userPost" v-model="form.postOfCaseOfficer" @change="caseOfficerOnChange"></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">負責職員 1 職位</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="職位" v-model="form.postOfCaseOfficerCN"></v-text-field>
            </v-col>
          </v-row>
           <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Phone number 聯絡電話</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Phone number 聯絡電話" v-model="form.phone"></v-text-field>
            </v-col>
          </v-row>
        <!-- ================================= -->
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Name of the Case officer 2</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Name of the Case officer" v-model="form.caseOfficer2"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">負責職員 2</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="負責職員" v-model="form.caseOfficerCN2"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Post of the Case officer 2</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-autocomplete hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Post of the Case officers" :items="userPost" v-model="form.postOfCaseOfficer2"></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">負責職員 2 職位</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="職位" v-model="form.postOfCaseOfficerCN2"></v-text-field>
            </v-col>
          </v-row>
           <v-row>
            <v-col cols="12" md="3">
              <span class="text--bold">Phone number 聯絡電話</span>
            </v-col>
            <v-col cols="12" md="9">
              <v-text-field hide-details="auto" required :rules="[rules.required]" outlined dense full-width placeholder="Phone number 聯絡電話" v-model="form.phone2"></v-text-field>
            </v-col>
          </v-row>
        <!-- ================================= -->
          <v-card-actions class="d-flex justify-space-between px-0 mt-8">
            <v-card-actions>
              <v-btn outlined color="primary" class="cancel-btn" @click="confirmLeaveDialog = true">
                Cancel
              </v-btn>
              <v-btn color="primary" @click="saveData({isGenereted: false},false)">
                Save
              </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn color="primary" @click="generateLetter(true)" :loading="isLoading">
                <span class="text--white">Inspection Proforma</span>
              </v-btn>
              <v-btn :disabled="!this.dsrnHandling.dsrnToBeServed" color="primary" @click="generateLetter(false)" :loading="isLoading">
                <span class="text--white">DSRN Documents</span>
              </v-btn>
            </v-card-actions>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card-text>
    <v-snackbar top color="#F44336" elevation="20" v-model="validationWarning">
      <h3 class="text text--white">Some text fields are empty</h3>
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="validationWarning = false">
            Close
          </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _findIndex from "lodash/findIndex";
import { mapMutations, mapActions } from "vuex";
import moment from "moment";
import { YEARS, MONTHS, DAYS, DEFECT_TYPES, DSRN_ACTION, DSRN_REASONS, SIGNBOARD_TYPE, POST_LIST, SIGN_TYPE_LIST } from "../../constants";
import { generateDocument } from "../../requests/signboard";
import { downloadGeneratedDocs } from "../utils/utils"

export default {
  data() {
    return {
      yearList: YEARS,
      monthList: MONTHS,
      dayList: DAYS,
      defectOption: DEFECT_TYPES,
      actionList: DSRN_REASONS,
      signTypeOption: SIGNBOARD_TYPE,
      confirmSaveDialog: false,
      confirmLeaveDialog: false,
      POST_LIST,
      SIGN_TYPE_LIST,
      signOwnerOption: [
        { id: "yes", title: "Advance"},
        { id: "no", title: "Public"}
      ],
      dateOfSurvey: [
          {
            title: "Year",
            id: "year",
            items: YEARS
          },
          {
            title: "Month",
            id: "month",
            items: MONTHS
          },
          {
            title: "Day",
            id: "day",
            items: DAYS
          }
        ],
      form: {
        dateOfSurvey: [],
        bdFile: '',
        addressSignOwers: '',
        addressSignOwersCN: '',
        signAddress: '',
        signAddressCN: '',
        areaCode: '',
        signOwer: '',
        signOwerCN: '',
        signCompany: '',
        signCompanyCn: '',
        signType: [],
        defectType: [],
        recordPhoto: '',
        actionRecommend: '',
        caseOfficer: '',
        caseOfficerCN: '',
        dsrnNo: '',
        postOfCaseOfficer: '',
        postOfCaseOfficerCN: '',
        phone: '',
        caseOfficer2: '',
        caseOfficerCN2: '',
        postOfCaseOfficer2: '',
        postOfCaseOfficerCN2: '',
        phone2: '',
        accountType: 'Advance'
      },
      rules: {
          required: value => !!value || "Required",
      },
      chosenImageDetails: {},
      isLoading: false,
      actionRecomWeeks: '',
      valid: false,
      tempUser: {
        name: '',
        chineseName: '',
        rank: '',
        phoneNumber: '',
        post: '',
        postCN: ''
      },
      validationWarning: false,
      annotationPlaceholder: { type: "Polygon", coordinates: [0,0] }
    }
  },
  methods: {
    ...mapMutations({
      setImageAnnotationDetails: "signboard/setImageAnnotationDetails",
      setDsrnAnnotation: "signboard/setDsrnAnnotation"
    }),
    ...mapActions({
      saveDSRNForm: "signboard/saveDSRNForm",
      getAllUsers: "user/getAllUsers",
      getUsersPost: "user/getUsersPost",
      updateDSRNHandling: "signboard/updateDSRNHandling"
    }),
    async generateLetter(generateProforma) {
      await this.$refs.form.validate();
      let templatePayload = [];

      if (this.valid === true) {

        this.isLoading = true;

        let processedSignType = [];
        let processedSignTypeCN = [];

        this.form.signType.map(signType => {
          processedSignType.push(this.SIGN_TYPE_LIST[signType].en);
          processedSignTypeCN.push(this.SIGN_TYPE_LIST[signType].cn);
        })

        const formData = {
            "date": ((this.surveyDate.split('-')).reverse()).join(" "),
            "todayDate": moment().format('DD MMMM YYYY'),
            "bdFile": this.form.bdFile,
            "signAddress": this.form.signAddress,
            "signAddressCN": this.form.signAddressCN,
            "signOwnerAddress": this.form.addressSignOwers,
            "signOwnerAddressCN": this.form.addressSignOwersCN,
            "dsrnNo": this.form.dsrnNo,
            "areaCode": this.form.areaCode,
            "signOwner": this.form.signOwer,
            "signOwnerCH": this.form.signOwerCN,
            "signCompany": this.form.signCompany,
            "signCompanyCN": this.form.signCompanyCn,
            "signType": processedSignType.join(", "),
            "signTypeCN": processedSignTypeCN.join(", "),
            "recordPhoto": this.imageURL ? this.imageURL : this.signImages[0].highResPath,
            "caseOfficerName": this.caseOfficer.name,
            "caseOfficerNameCN": this.caseOfficer.chineseName,
            "caseOfficerPost": this.caseOfficer.post,
            "caseOfficerPostCN": this.caseOfficer.postCN,
            "caseOfficerRank": this.caseOfficer.rank,
            "caseOfficerPhone": this.form.phone,

            "caseOfficerName2": this.form.caseOfficer2,
            "caseOfficerNameCN2": this.form.caseOfficerCN2,
            "caseOfficerPost2": this.form.postOfCaseOfficer2,
            "caseOfficerPostCN2": this.form.postOfCaseOfficerCN2,
            "caseOfficerPhone2": this.form.phone2,
            
            "seniorOfficerName": this.seniorOfficer.name,
            "seniorOfficerNameCN": this.seniorOfficer.chineseName,
            "seniorOfficerPost": this.seniorOfficer.post,
            "seniorOfficerPostCN": this.seniorOfficer.postCN,
            "seniorOfficerRank": this.seniorOfficer.rank,
            "seniorOfficerPhone": this.seniorOfficer.phoneNumber,
            "assistantName": this.assistantOfficer.name,
            "assistantNameCN": this.assistantOfficer.chineseName,
            "assistantRank": this.assistantOfficer.rank,
            "surveyTripId": this.storeSelectedSignboard.tripRefId,
            "defectType": {
                "a": this.form.defectType.includes(this.defectOption[0].id),
                "b": this.form.defectType.includes(this.defectOption[1].id),
                "c": this.form.defectType.includes(this.defectOption[2].id),
                "d": this.form.defectType.includes(this.defectOption[3].id),
                "e": this.form.defectType.includes(this.defectOption[4].id)
            },
            "actionRecom": {
                "immediate": (this.form.actionRecommend === this.actionList[0].id) ? true : false,
                "serve": (this.form.actionRecommend === this.actionList[1].id) ? true : false,
                "recom": (this.form.actionRecommend === this.actionList[2].id) ? true : false,
                "weeks": (this.form.actionRecommend === this.actionList[2].id) ? this.actionRecomWeeks : ""
            },
            "account": {
                "advance": (this.form.accountType === "Advance") ? true : false,
                "public": (this.form.accountType === "Public") ? true : false,
            }
          }
        if(generateProforma){
          templatePayload = [
            {
              "template": {
                "shortid": "k4ElAX5nsl"
              },
              "options": {
                "reports": { 
                  "save": true,
                  "blobName": `Inspection Proforma Form - ${this.form.dsrnNo}`
                }
              },
              "data": formData
            }
          ]
        }
        else{
            templatePayload = [
              {
                "template": {
                  "shortid": "BwI-yldilo"
                },
                "options": {
                  "reports": { 
                    "save": true,
                    "blobName": `DSRN Letter - ${this.form.dsrnNo}`
                  }
                },
                "data": formData
              },
            ];

            if(this.form.accountType == "Advance"){
              templatePayload.push(
                {
                  "template": {
                    "shortid": "vQ0hney5yr"
                  },
                  "options": {
                    "reports": { 
                      "save": true,
                      "blobName": `Cover Letter - ${this.form.dsrnNo}`
                    }
                  },
                  "data": formData
                },
              )
            }
        }

        for (let i = 0; i < templatePayload.length; i++) {
          const response = await generateDocument(templatePayload[i])
          const downloadLink = response.headers["permanent-link"]
          const fileName = response.headers["report-blobname"];
          await downloadGeneratedDocs({
            downloadLink,
            fileName
          })
        }

        this.saveData({isGenereted: true},generateProforma);

        this.isLoading = false;
      } else {
        this.validationWarning = true;
      }
    },
    closeTool() {
      this.$refs.form.resetValidation();
      this.form.recordPhoto = '';
      this.$emit('close-expanded-view');
    },
    onImageClick(selectedImageId) {
      const foundImageObject = this.signImages.find((image) => image._id === selectedImageId);

      if (foundImageObject !== undefined) {
        this.chosenImageDetails = {...foundImageObject, medResPath: foundImageObject.mediumResPath, imgId: selectedImageId};
        
        let imageAnnotationDetails = {
          imgSrc: foundImageObject.highResPath,
          imgId: selectedImageId,
          fromSignboardDetail: true,
          isDefectTool: true,
          signboardAnnotationList: this.chosenImageDetails.coordinates,
          cameraLocation: this.chosenImageDetails.cameraLocation
        }
        this.setImageAnnotationDetails(imageAnnotationDetails);
        if (selectedImageId !== this.dataForm.recordPhoto) {
          this.setDsrnAnnotation('');
        } else {
          this.setDsrnAnnotation(this.dataForm.location);
        }
      }
    },
    async initValue() {
      if (!("dsrnNo" in this.dataForm) ) {
        this.form.bdFile = this.fileRefNo
        this.form.signAddress = this.address
        this.form.areaCode = this.areaCode
        this.form.dsrnNo = this.dsrnNo
      }
      else {
        this.form = await {...this.dataForm}
      }

      this.form.dateOfSurvey = this.surveyDate.split('-');
      this.initCaseOfficer();
      this.initAnnotations();
    },
    userDataProcessing(user) {
      let data = {
        name: "",
        chineseName: "",
        rank: "",
        phoneNumber: "",
        post: "",
        postCN: ""
      }
      if (!_isEmpty(user)) {
        const postArr = user.post.split('/');
        const mainPost = POST_LIST[postArr[0]].en;
        const subPost = POST_LIST[postArr[1].match(/[a-zA-Z]+/g)].en;
        const noPost = postArr[1].match(/\d+/g);
        const mainPostCN = POST_LIST[postArr[0]].cn;
        const subPostCN = POST_LIST[postArr[1].match(/[a-zA-Z]+/g)].cn;
        const noPostCN = postArr[1].match(/\d+/g);
        const post = mainPost + " / " + subPost + " " + noPost;
        const postCN = mainPostCN + "/" + subPostCN + noPostCN;
        data = {
          name: user.englishName,
          chineseName: user.chineseName,
          rank: user.post,
          phoneNumber: user.phoneNumber,
          post: post,
          postCN: postCN
        };
      }
        return data;
    },
    async saveData({isGenereted},generateProforma) {
      let generatedData = {}

      if (isGenereted) {
        if(generateProforma){
          generatedData = {
            inspectionProformaPath:'generated'
          } 
        }
        else{
          generatedData = {
            dsrnPath: 'generated',
            coveringLetterPath: 'generated'
          }
        }
      }

      this.confirmSaveDialog = true;

      await this.saveDSRNForm({
          signboardId: this.storeSelectedSignboard.signboardId,
          form: {
              dateOfSurvey: this.surveyDate,
              bdFile: this.form.bdFile,
              addressSignOwers: this.form.signAddress,
              addressSignOwersCN: this.form.signAddressCN,
              signAddress: this.form.addressSignOwers,
              signAddressCN: this.form.addressSignOwersCN,
              areaCode: this.form.areaCode,
              signOwer: this.form.signOwer,
              signOwerCN: this.form.signOwerCN,
              recordPhoto: this.form.recordPhoto,
              actionRecommend: this.form.actionRecommend,
              caseOfficer: this.form.caseOfficer,
              caseOfficerCN: this.form.caseOfficerCN,
              dsrnNo: this.form.dsrnNo,
              location: (this.dsrnAnnotation !== '') ? this.dsrnAnnotation : this.annotationPlaceholder,
              postOfCaseOfficer: this.form.postOfCaseOfficer,
              postOfCaseOfficerCN: this.form.postOfCaseOfficerCN,
              phone: this.form.phone,
              defectType: this.form.defectType,
              signType: this.form.signType,
              signCompany: this.form.signCompany,
              signCompanyCn: this.form.signCompanyCn,
              caseOfficer2: this.form.caseOfficer2,
              caseOfficerCN2: this.form.caseOfficerCN2,
              postOfCaseOfficer2: this.form.postOfCaseOfficer2,
              postOfCaseOfficerCN2: this.form.postOfCaseOfficerCN2,
              phone2: this.form.phone2,
              accountType: this.form.accountType
          },
          dsrnHandling: {
            ...this.dsrnHandling,
            dsrnNo: this.form.dsrnNo,
            ...generatedData
          },
          peopleInCharge: {
            ...this.peopleInCharge,
            caseOfficer: this.form.postOfCaseOfficer
          }
      });
    },
    caseOfficerOnChange() {
      this.updateDSRNHandling({
        signboardId: this.storeSelectedSignboard.signboardId,
        dsrnHandling: {
          ...this.dsrnHandling,
        },
        peopleInCharge: {
          ...this.peopleInCharge,
          caseOfficer: this.form.postOfCaseOfficer
        }
      })
    },
    initCaseOfficer() {
      this.form.caseOfficer = this.caseOfficer.name;
      this.form.caseOfficerCN = this.caseOfficer.chineseName;
      this.form.postOfCaseOfficer = this.caseOfficer.rank;
      this.form.postOfCaseOfficerCN = this.caseOfficer.postCN;
      this.form.phone = this.caseOfficer.phoneNumber;
    },
    initAnnotations() {
      const recordPhoto = _get(this.dataForm, 'recordPhoto', '');
      if (recordPhoto !== '') {
        this.onImageClick(recordPhoto);
      }
    }
  },
  computed: {
    storeSelectedSignboard() {
      return !_isEmpty(this.$store.state.signboard.selectedSignboard.location) ? this.$store.state.signboard.selectedSignboard : [];
    },
    peopleInCharge() {
      return this.storeSelectedSignboard.peopleInCharge;
    },
    dsrnHandling() {
      return this.storeSelectedSignboard.dsrnHandling;
    },
    signImages() {
      return this.storeSelectedSignboard.images ? this.storeSelectedSignboard.images : [];
    },
    imageComputed() {
      return this.chosenImageDetails.highResPath ? this.chosenImageDetails.highResPath : ''
    },
    surveyId() {
      return !_isEmpty(this.storeSelectedSignboard) ? this.storeSelectedSignboard.tripRefId : "";
    },
    surveyDate() {
      const dateString = !_isEmpty(this.$store.state.signboard.tripList)
        ? this.$store.state.signboard.tripList.find(trip => {
            return trip.refId === this.surveyId;
          }).startTime
        : "";

      return moment(dateString).format("YYYY-MMMM-DD"); 
    },
    fileRefNo() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails) ? this.storeSelectedSignboard.buildingDetails.fileRef : "";
    },
    address() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails) ? this.storeSelectedSignboard.buildingDetails.englishAddress : "";
    },
    areaCode() {
      return !_isEmpty(this.storeSelectedSignboard.buildingDetails) ? this.storeSelectedSignboard.buildingDetails.areaCode : "";
    },
    defectTypes() {
      return !_isEmpty(this.storeSelectedSignboard.defectTypes) ? this.storeSelectedSignboard.defectTypes : "";
    },
    dsrnNo() {
      return this.dsrnHandling.dsrnNo;
    },
    imageURL() {
      return this.$store.state.signboard.imageURL
    },
    signboardRevisionStatus() {
      return _get(this.$store.state, "signboard.selectedSignboard.revisionStatus.signboardIdentificationRevised.status", "");
    },
    allUsers() {
      return this.$store.state.user.allUsers
    },
    caseOfficer() {
      if (!_isEmpty(this.peopleInCharge.caseOfficer)) {
        const user = this.allUsers[_findIndex(this.allUsers, (user) => user.post === this.peopleInCharge.caseOfficer)];
        return this.userDataProcessing(user);
      }
      else {
        return this.tempUser;
      }
    },
    seniorOfficer() {
      const user = this.allUsers[_findIndex(this.allUsers, (user) => user.post === this.peopleInCharge.seniorPro)];
      return this.userDataProcessing(user);
    },
    assistantOfficer() {
      const user = this.allUsers[_findIndex(this.allUsers, (user) => user.post === this.peopleInCharge.caseAssistant)];
      return this.userDataProcessing(user);
    },
    userPost() {
      return this.$store.state.user.userPost;
    },
    dataForm() {
      return this.storeSelectedSignboard.form;
    },
    dsrnAnnotation() {
      return this.$store.state.signboard.dsrnAnnotation;
    }
  },
  async mounted() {
    await this.getAllUsers(window.localStorage.getItem("userId"));
    await this.getUsersPost({ searchString: "." });
    this.initValue();
  },
  watch: {
    "form.accountType"(val) {
      if(this.form.accountType === 'Public'){
        this.form.signOwer = '';
        this.form.signOwerCN = '';
        this.form.signCompany = '';
        this.form.signCompanyCn = '';
      }
    },
    surveyDate: {
      handler() {
        let date = this.surveyDate.split('-')
        this.form.date.year = date[0]
        this.form.date.month = date[1]
        this.form.date.day = date[2]
      }
    },
    fileRefNo: {
      handler() {
        this.form.bdFile = this.fileRefNo
      }
    },
    address: {
      handler() {
        this.form.signAddress = this.address
      }
    },
    areaCode: {
      handler() {
        this.form.areaCode = this.areaCode
      }
    },
    defectTypes: {
      handler() {
        this.form.defectType = this.defectTypes
      }
    },

    caseOfficer() {
      this.initCaseOfficer();
    },
    storeSelectedSignboard() {
      this.initValue();
      this.$refs.form.resetValidation();
    },
    dataForm() {
      this.setDsrnAnnotation(this.dataForm.location);
    },
    signImages() {
      this.initAnnotations();
    }
  }
}
</script>

<style>
.disable-input{
  background-color:#F5F5F5;
}
</style>