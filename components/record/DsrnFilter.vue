<template>
  <div class="dsrn-filter">
    <div class="dsrn-filter__container">
      <template v-if="selectedSubTab === 'dsrnToBeServed'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">DSRN to be served</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="dsrnToBeServed" active-class="selected">
            <v-chip :key="change.id" v-for="change of dsrnServedChanges" outlined label :ripple="false" :value="change.val" class="dsrn-filter__chip">
              <span class="text text--secondary-style">{{ change.title }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </template>
      <template v-if="selectedSubTab === 'dsrnNo'">
        <div class="title-container">
          <div class=" text text--medium text--secondary-style space-below dsrn-filter__custom-text">DSRN No.</div>
        </div>
        <div class="signboard-id__search-input-container">
          <v-text-field v-model="dsrnNoSearchVal" outlined dense append-icon="mdi-magnify" @keyup="onDsrnNoChange" full-width label="Specific No. / Range of No."></v-text-field>
        </div>
        <div class="signboard-id__search-result-area">
          <div class="signboard-id__wrapper">
            <template v-if="dsrnNoSearchVal">
              <div class="font-weight-medium">'{{ dsrnNoSearchVal }}' search result ({{dsrnNoList.length}})</div>
              <div>
                <v-btn color="transparent" elevation="0" @click="selectAlldsrnNo"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                <v-btn color="transparent" elevation="0" @click="clearAlldsrnNo"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
              </div>
            </template>         
          </div>
          <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
          <ul class="signboard-id__list-container px-0">
            <li v-for="item in dsrnNoListPagination" :key="item" class="signboard-id__list-item-container">
              <v-checkbox v-model="dsrnNo" active-class="selected" :value="item"></v-checkbox>
                {{ item }}
            </li>
          </ul>
          <div class="signboard-id__pagination-result">
            <v-pagination
              v-if="pagination.total >= pagination.itemPerPage"
              v-model="pagination.page"
              :length="Math.ceil(pagination.total / pagination.itemPerPage)"
              :total-visible="5"
            ></v-pagination>
          </div>
        </div>
      </template>
      <template v-if="selectedSubTab === 'dsrnNotServeReason'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">Reason of not serving DSRN</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="dsrnNotServeReason" multiple active-class="selected">
            <v-tooltip :key="change.id" v-for="change of dsrnReasonChanges" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip outlined label :ripple="false" :value="change.value" class="dsrn-filter__chip" v-bind="attrs" v-on="on">
                  <span class="text text--secondary-style">{{ change.title }}</span>
                </v-chip>
              </template>
              <span>{{change.text}}</span>
            </v-tooltip>
          </v-chip-group>
        </div>
      </template>
      <template v-if="selectedSubTab === 'account'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">Account</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="account" active-class="selected">
            <v-chip :key="change.id" v-for="change of dsrnAccountChanges" outlined label :ripple="false" :value="change.id" class="dsrn-filter__chip">
              <span class="text text--secondary-style">{{ change.title }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </template>
      <template v-if="selectedSubTab === 'signboardOwnerNAddress'">
        <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">Signboard Owner and Address</div>
        <v-radio-group v-model="dsrnOwnerRadioGroup" class="signboard-id__search-input-container">
          <v-text-field v-model="signOwnerSearchVal" class="field" @keyup="onSignOwnerSearch" outlined dense append-icon="mdi-magnify" full-width label="Search Owner and Address">
            <template v-slot:prepend>
              <v-radio value="exact"></v-radio>
            </template>
          </v-text-field>
          <v-radio value="blank" label="Blank"></v-radio>
        </v-radio-group>
        <div class="signboard-id__search-result-area">
          <div class="signboard-id__wrapper">
            <template v-if="signOwnerSearchVal">
              <div class="font-weight-medium">'{{ signOwnerSearchVal }}' search result ({{signOwnerList.length}})</div>
              <div>
                <v-btn color="transparent" elevation="0" @click="selectAllsignOwner()"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                <v-btn color="transparent" elevation="0" @click="clearAllsignOwner()"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
              </div>
            </template>         
          </div>
          <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
          <ul class="signboard-id__list-container px-0">
            <li v-for="item in signOwnerListPagination" :key="item" class="signboard-id__list-item-container">
              <v-checkbox v-model="signboardOwnerNAddress" active-class="selected" :value="item"></v-checkbox>
                {{ item }}
            </li>
          </ul>
          <div class="signboard-id__pagination-result">
            <v-pagination
              v-if="pagination.total >= pagination.itemPerPage"
              v-model="pagination.page"
              :length="Math.ceil(pagination.total / pagination.itemPerPage)"
              :total-visible="5"
            ></v-pagination>
          </div>
        </div>
      </template>
      <template v-if="selectedSubTab === 'inspectionProformaPath'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">Inspection Proforma</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="inspectionProformaPath" active-class="selected">
            <v-chip :key="change.id" v-for="change of dsrnProformaChanges" outlined label :ripple="false" :value="change.id" class="dsrn-filter__chip">
              <span class="text text--secondary-style">{{ change.title }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </template>
      <template v-if="selectedSubTab === 'dsrnPath'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">DSRN</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="dsrnPath" active-class="selected">
            <v-chip :key="change.id" v-for="change of dsrnGenerateChanges" outlined label :ripple="false" :value="change.id" class="dsrn-filter__chip">
              <span class="text text--secondary-style">{{ change.title }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </template>
      <template v-if="selectedSubTab === 'coveringLetterPath'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">Covering Letter for DSRN</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="coveringLetterPath" active-class="selected">
            <v-chip :key="change.id" v-for="change of dsrnLetterChanges" outlined label :ripple="false" :value="change.id" class="dsrn-filter__chip">
              <span class="text text--secondary-style">{{ change.title }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </template>
      <template v-if="selectedSubTab === 'actionTaken'">
        <div class="title-container">
          <div class="text text--medium text--secondary-style space-below dsrn-filter__custom-text">Action Taken</div>
        </div>
        <div class="dsrn-filter__tag-container">
          <v-chip-group v-model="actionTaken" active-class="selected">
            <v-chip :key="change.id" v-for="change of dsrnActionChanges" outlined label :ripple="false" :value="change.id" class="dsrn-filter__chip">
              <span class="text text--secondary-style">{{ change.title }}</span>
            </v-chip>
          </v-chip-group>
        </div>
      </template>
      
    </div>
  </div>
</template>

<script>
import {mapFields} from 'vuex-map-fields';
import { mapActions, mapMutations } from 'vuex';
import clientSidePaginationMixin from "../../mixins/client-side-pagination.js";

export default {
    mixins: [clientSidePaginationMixin],
    props: ['selectedSubTab'],
    data() {
        return {
            dsrnServedChanges: [
                { id: "yes", title: "Yes", val: true},
                { id: "no", title: "No", val: false},
                { id: "blank", title: "Blank", val: null},
            ],
            dsrnReasonChanges: [
                { value: "dsrnIssued",text: "DSRN/ s.24 order was issued", title: "(1)"},
                { value: "signMaintained", text: "The sign was erected or maintained by other B/Ds", title: "(2)"},
                { value: "notDangerous", text: "Not likely to become dangerous", title: "(3)"},
                { value: "keepView", text: "Keep in view", title: "(4)"},
                { value: "otherReasons", text: "Others", title: "(5)"},
            ],
            dsrnAccountChanges: [
                { id: "public", title: "Public"},
                { id: "advance", title: "Advance"}
            ],
            dsrnProformaChanges: [
                { id: "generated", title: "Generated"},
                { id: "not generated", title: "Not Generated"}
            ],
            dsrnGenerateChanges: [
                { id: "generated", title: "Generated"},
                { id: "not generated", title: "Not Generated"}
            ],
            dsrnLetterChanges: [
                { id: "generated", title: "Generated"},
                { id: "not generated", title: "Not Generated"}
            ],
            dsrnActionChanges: [
                { id: "taken", title: "Taken"},
                { id: "pending", title: "Pending"}
            ],
            dsrnNoInput: "",
            dsrnOwnerRadioGroup: "exact",
            dsrnOwnerInput: "",
            blankVal: null,
            isLoading: false
        }
    },
    computed: {
        ...mapFields({
            dsrnToBeServed: "record.filter.dsrn.dsrnToBeServed.value",
            dsrnNo: "record.filter.dsrn.dsrnNo.value",
            dsrnNotServeReason: "record.filter.dsrn.dsrnNotServeReason.value",
            account: "record.filter.dsrn.account.value",
            signboardOwnerNAddress: "record.filter.dsrn.signboardOwnerNAddress.value",
            inspectionProformaPath: "record.filter.dsrn.inspectionProformaPath.value",
            dsrnPath: "record.filter.dsrn.dsrnPath.value",
            coveringLetterPath: "record.filter.dsrn.coveringLetterPath.value",
            actionTaken: "record.filter.dsrn.actionTaken.value",
            dsrnNoSearchVal: "record.dsrnNoSearchVal",
            signOwnerSearchVal: "record.signOwnerSearchVal",
            signOwnerList: "record.signOwnerAddressList"
        }),
        dsrnNoList() {
          return this.$store.state.record.dsrnNoList;
        },
        dsrnNoListPagination() {
          return this.dsrnNoList.filter((id, index) => index >= this.start && index <= this.end);
        },
        signOwnerListPagination() {
          return this.signOwnerList.filter((id, index) => index >= this.start && index <= this.end);
        },
    },
    methods: {
        ...mapActions({
          searchDsrnNo: "record/searchDsrnNo",
          signOwnerSearch: "record/signOwnerSearch"
        }),
        ...mapMutations({
          removeValue: "record/removeValue",
        }),
        async onDsrnNoChange() {
          this.isLoading = true;
          await this.searchDsrnNo({ searchString: this.dsrnNoSearchVal});
          this.isLoading = false;
        },
        selectAlldsrnNo() {
          this.dsrnNo = this.dsrnNoList;
        },
        clearAlldsrnNo() {
          this.dsrnNo = [];
        },
        async onSignOwnerSearch() {
          this.isLoading = true;
          await this.signOwnerSearch({ searchString: this.signOwnerSearchVal});
          this.isLoading = false;
        },
        selectAllSignOwner() {
          this.signboardOwnerNAddress = this.signOwnerList;
        },
        clearAllsignOwner() {
          this.signboardOwnerNAddress = [];
        }
    },
    watch: {
        dsrnOwnerRadioGroup (val) {
            if (val == 'blank') {
                this.removeValue({valueToRemove: "", tab: 'dsrn', field: 'signboardOwnerNAddress', valueType: 'string'});
                this.signOwnerSearchVal = '';
                this.signOwnerList = [];
            }
        },
        dsrnNoList() {
          this.resultsWatcher(this.dsrnNoList);
        },
        signOwnerList() {
          this.resultsWatcher(this.signOwnerList);
        }
    },
}
</script>