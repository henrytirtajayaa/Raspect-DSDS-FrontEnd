<template>
    <div class="table-display-menu">
        <div>
            <template>
                <v-tabs
                    v-model="tabModel"
                    align-with-title
                    grow
                >
                    <v-tab
                        v-for="item in tabs"
                        :key="item.id"
                    >
                        <div class="text text--bold text--small">{{ item.title }}</div>
                    </v-tab>
                </v-tabs>
            </template>
        </div>
        <v-tabs-items v-model="tabModel">
            <v-tab-item
                key="sortedBy"
            >
                <div class="table-display-menu__drag-container">
                    <draggable v-model="fields" @start="drag=true" @end="drag=false" group="people">
                        <div v-for="element in shownFields" :key="element.id" :class="{'table-display-menu__tile': true, selected: element.id === localSelectedSortingColumn.columnId}" @click="onSelect(element.id)">
                            <div class="table-display-menu__tile-content-container">
                                <div>
                                    <span><v-icon>mdi-drag-vertical</v-icon></span><span class="text text--secondary-style text--small">{{element.text}}</span>
                                </div>
                                <div v-if="element.id === selectedSortingColumn.columnId" class="table-display-menu__icon-container">
                                    <v-icon color="primary">
                                        <template v-if="selectedSortingColumn.order == 'asc'">
                                            mdi-arrow-up
                                        </template>
                                        <template v-else-if="selectedSortingColumn.order == 'desc'">
                                            mdi-arrow-down
                                        </template>
                                    </v-icon>
                                    <span class="text text--secondary-style text--small text--blue">
                                        {{ selectedSortingColumn.order }}
                                    </span>
                                </div>
                                <div v-if="element.id === localSelectedSortingColumn.columnId && element.id !== selectedSortingColumn.columnId" class="table-display-menu__icon-container">
                                    <v-icon>
                                        <template v-if="localSelectedSortingColumn.order == 'asc'">
                                            mdi-arrow-up
                                        </template>
                                        <template v-else-if="localSelectedSortingColumn.order == 'desc'">
                                            mdi-arrow-down
                                        </template>
                                    </v-icon>
                                    <span class="text text--secondary-style text--small">
                                        {{ localSelectedSortingColumn.order }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </draggable>
                </div>
                <v-divider></v-divider>
                <div>
                    <v-btn elevation="0" color="white" :ripple="false" @click="onOrderClick('asc')">
                        <v-icon :color="arrowColor.asc">mdi-arrow-up</v-icon>
                        <span class="text" :class="textColor.asc">Ascending</span>
                    </v-btn>
                </div>
                <v-btn elevation="0" color="white" :ripple="false" @click="onOrderClick('desc')">
                    <v-icon :color="arrowColor.desc">mdi-arrow-down</v-icon>
                    <span class="text" :class="textColor.desc">Descending</span>
                </v-btn>
            </v-tab-item>
            <v-tab-item
                key="fields"
            >
                <div class="text space-above text--bold">Shown Fields</div>
                <draggable v-model="fields" @start="drag=true" @end="drag=false" group="people">
                    <div v-for="element in shownFields" :key="element.id" class="table-display-menu__tile">
                        <div>
                            <span><v-icon>mdi-drag-vertical</v-icon></span><span class="text">{{element.text}}</span>
                        </div>
                        <v-checkbox v-model="checkbox" :value="element.id" @click="onChange(element, $event)"></v-checkbox>
                    </div>
                </draggable>
                <div class="text space-above space-below text--bold">Hidden Fields</div>
                <div v-for="element in hiddenFields" :key="element.id" class="table-display-menu__tile">
                    <div>
                        <span><v-icon>mdi-drag-vertical</v-icon></span><span class="text">{{element.text}}</span>
                    </div>
                    <v-checkbox v-model="hiddenFieldCheckbox" :value="element.id" :input-value="true" @click="onHiddenChange(element, $event)"></v-checkbox>
                </div>
            </v-tab-item>
        </v-tabs-items>
        <v-divider></v-divider>
        <div class="space-above table-display-menu__button-container">
            <v-btn outlined class="space-right" color="primary" @click="close">
                <span class="text text--bold text--blue">Cancel</span>
            </v-btn>
            <v-btn color="primary" @click="save" >
                <span class="text text--bold text--white">Apply</span>
            </v-btn>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import _difference from "lodash/difference"
import { mapMutations, mapActions } from 'vuex';
import { DEFAULT_DISPLAY_FIELDS } from '../../constants';

export default {
    components: {
        draggable
    },
    data() {
        return {
            localSelectedSortingColumn: {columnId: "", order: ""},
            tabs: [{ id: "sortedBy", title: "Sorted by"}, { id: 'fields', title: "Fields"}],
            tabModel: "",
            arrowColor: {asc: "", desc: ""},
            textColor: {asc: "", desc: ""}
        }
    },
    computed: {
        hiddenFields() {
            let defaultKeys = DEFAULT_DISPLAY_FIELDS.map((field)=> field.id);

            let diffArray = _difference(defaultKeys, this.checkbox);

            return DEFAULT_DISPLAY_FIELDS.filter((field) => { return diffArray.includes(field.id) })
        },
        shownFields() {
            return this.fields.filter((field) => {
                return this.checkbox.includes(field.id);
            })
        },
        fields: {
            get() {
                return this.$store.state.record.displayFields;
            },
            set(value) {
                this.$store.commit('record/updateDisplayFields', value);
            }
        },
        checkbox: {
            get() {
                return this.$store.state.record.checkbox;
            },
            set(value) {
                this.$store.commit('record/updateCheckbox', value);
            }
        },
        hiddenFieldCheckbox: {
            get() {
                return this.$store.state.record.hiddenFieldCheckbox;
            },
            set(value) {
                this.$store.commit('record/updateHiddenFieldCheckbox', value);
            }
        },
        defaultFields () {
            return this.$store.state.record.defaultDisplayFields;
        },
        selectedSortingColumn() {
            return this.$store.state.record.sort;
        }
    },
    methods: {
        onChange(field, e) {
            this.hiddenFieldCheckbox = [...this.hiddenFieldCheckbox, field.id];
            
            this.filterDisplayFields(field.id);
        },
        onHiddenChange(field, e) {
            this.checkbox = [...this.checkbox, field.id];
            let fieldToBeAdded = DEFAULT_DISPLAY_FIELDS.find((elem) => {
                return elem.id === field.id;
            })
            this.addToDisplayFields(fieldToBeAdded);
        },
        async save() {
            this.setOrder(this.fields);
            this.setSortSetting(this.localSelectedSortingColumn);
            await this.filterRecords({filter: this.$store.state.record.filter, sort: this.localSelectedSortingColumn});

            this.$emit("save-apply-display", this.fields, this.hiddenFieldCheckbox, false);
        },
        close(){
            this.$emit("close-display-menu");
        },
        onSelect(id) {
            this.localSelectedSortingColumn = { ...this.localSelectedSortingColumn, columnId: id };
            if (id === this.selectedSortingColumn.columnId) {
                this.orderSelection(this.selectedSortingColumn.order);
            }
            else {
                this.orderSelection(this.localSelectedSortingColumn.order);
            }
        },
        onOrderClick(order) {
            this.localSelectedSortingColumn = { ...this.localSelectedSortingColumn, order };
            this.orderSelection(order);
        },
        ...mapMutations({
            setSortSetting: "record/setSortSetting",
            setOrder: "record/setOrder",
            filterDisplayFields: "record/filterDisplayFields",
            addToDisplayFields: "record/addToDisplayFields"
        }),
        ...mapActions({
            filterRecords: "record/filterRecords"
        }),
        orderSelection(order) {
            if (order === 'asc') {
                this.arrowColor= {asc: "primary", desc: ""},
                this.textColor= {asc: "text--blue", desc: ""}
            }
            else if (order === 'desc') {
                this.arrowColor= {asc: "", desc: "primary"},
                this.textColor= {asc: "", desc: "text--blue"}
            }
        }
    },
    watch: {
        '$store.state.record.sort.columnId' : {
            handler(val) {
                this.localSelectedSortingColumn.columnId = val;
            }
        },
        '$store.state.record.sort.order' : {
            handler(val) {
                this.localSelectedSortingColumn.order = val;
            }
        },
        selectedSortingColumn() {
            if (this.localSelectedSortingColumn.columnId === this.selectedSortingColumn.columnId) {
                this.orderSelection(this.selectedSortingColumn.order);
            }
        }
    }
}
</script>