<template>
    <div class="people-filter">
        <div class="people-filter__container">
            <template v-for="type in people">
                <div v-if="selectedSubTab === type.name" :key="type.id">
                    <div class="title-container">
                        <div class="text text--medium text--secondary-style space-below people-filter__custom-text">
                            Case Assistant
                        </div>
                    </div>
                    <div class="signboard-id__search-input-container">
                        <v-text-field v-model="type.value" outlined dense append-icon="mdi-magnify" full-width label="Case Assistant's Post" @keyup="onSearch(type.id, type.name)"></v-text-field>
                    </div>
            
                <div class="signboard-id__search-result-area" v-if="type.value">
                    <div class="signboard-id__wrapper">
                        <template >
                            <p class="font-weight-medium">'{{ type.value }}' search result ({{peopleInCharge[type.id].list.length}})</p>
                            <div>
                                <v-btn color="transparent" elevation="0" @click="selectAll(type.id)"><span class="text text--secondary-style text--blue text--bold">Select All</span></v-btn>
                                <v-btn color="transparent" elevation="0" @click="clearAll(type.id)"><span class="text text--secondary-style text--blue text--bold">Clear All Selection</span></v-btn>
                            </div>
                        </template>
                    </div>
                    <v-progress-linear v-show="isLoading" color="primary" indeterminate></v-progress-linear>
                    <ul class="signboard-id__list-container px-0">
                        <li v-for="item in paginationList[type.id]" :key="item" class="signboard-id__list-item-container">
                            <v-checkbox v-model="type.selected" active-class="selected" class="mt-0" :value="item"></v-checkbox>
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
            </div>
            </template>
        </div>
    </div>
</template>
<script>
import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';
import _cloneDeep from "lodash/cloneDeep";
import clientSidePaginationMixin from "../../mixins/client-side-pagination.js";

export default {
    mixins: [clientSidePaginationMixin],
    data() {
        return {
            isLoading: false,
            people: []
        }
    },
    props: ['selectedSubTab'],
    computed: {
        ...mapFields({
            seniorProFilterList: "record.filter.peopleInCharge.seniorPro.value",
            caseOfficerFilterList: "record.filter.peopleInCharge.caseOfficer.value",
            caseAssistantFilterList: "record.filter.peopleInCharge.caseAssistant.value",
            peopleInCharge: "record.peopleInCharge",
            
        }),
        paginationList() {
            let list = [];
            this.peopleInCharge.map((item) => {
                list.push(item.list.filter((id, index) => index >= this.start && index <= this.end));
            })
            return list;
        }
    },
    methods: {
        ...mapActions({
            searchPeople: "record/searchPeople"
        }),
        async onSearch(index, name) {
            this.isLoading = true;
            await this.searchPeople({searchString: this.people[index].value, searchType: name});
            this.isLoading = false;
        },
        selectAll(type) {
            this.people[type].selected = this.people[type].pagination;
        },
        clearAll(type) {
            this.people[type].selected = [];
        }
    },
    watch: {
        people: {
            deep: true,
            handler(object) {
                this.seniorProFilterList = this.people[0].selected;
                this.caseOfficerFilterList = this.people[1].selected;
                this.caseAssistantFilterList = this.people[2].selected;
            }
        }
    },
    mounted() {
        this.people = _cloneDeep(this.peopleInCharge);
        this.people[0].selected = this.seniorProFilterList;
        this.people[1].selected = this.caseOfficerFilterList;
        this.people[2].selected = this.caseAssistantFilterList;
    }
}
</script>