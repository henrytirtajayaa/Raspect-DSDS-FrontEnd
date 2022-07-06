<template>
    <div class="mod-filter">
        <div class="mod-filter__container">
            <template v-if="selectedSubTab === 'signboardIdentificationRevised'">
                <div class="mod-filter__filter-container">
                    <div class="title-container">
                        <div class="text text--medium text--secondary-style space-below mod-filter__custom-text">Signboard Identification Revised</div>
                    </div>
                    <div class="mod-filter__tag-container">
                        <v-chip-group v-model="signboardIdentificationRevised" active-class="selected">
                            <v-chip :key="change.id" v-for="change of signboardChanges" outlined label :ripple="false" :value="change.id" class="mod-filter__chip">
                                <span class="text text--secondary-style">{{ change.title }}</span>
                            </v-chip>
                        </v-chip-group>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'boundingAreaRevised'">
                <div class="mod-filter__filter-container">
                    <div class="title-container">
                        <div class="text text--medium text--secondary-style space-below mod-filter__custom-text">Bounding Area Modified</div>
                    </div>
                    <div class="mod-filter__tag-container">
                        <v-chip-group v-model="boundingAreaRevised" active-class="selected">
                            <v-chip :key="change.id" v-for="change of modAreas" outlined label :ripple="false" :value="change.id" class="mod-filter__chip">
                                <span class="text text--secondary-style">{{ change.title }}</span>
                            </v-chip>
                        </v-chip-group>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'defectiveSignboardRevised'">
                <div class="mod-filter__filter-container">
                    <div class="title-container">
                        <div class="text text--medium text--secondary-style space-below mod-filter__custom-text">Defective Signboard Revised</div>
                    </div>
                    
                    <div class="mod-filter__tag-container">
                        <v-chip-group v-model="defectiveSignboardRevised" active-class="selected">
                            <v-chip :key="change.id" v-for="change of defectSignboardChanges" outlined label :ripple="false" :value="change.id" class="mod-filter__chip">
                                <span class="text text--secondary-style">{{ change.title }}</span>
                            </v-chip>
                        </v-chip-group>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'defectTypeModified'">
                <div class="mod-filter__filter-container">
                    <div class="title-container">
                        <div class="text text--medium text--secondary-style space-below mod-filter__custom-text">Defect Types Modified</div>
                    </div>
                    <div class="mod-filter__tag-container">
                        <v-radio-group v-model="defectTypeModified">
                            <v-radio :key="change.id" v-for="change of defectTypeChanges" outlined :label="change.title" :ripple="false" :value="change.id">
                                <span class="text text--secondary-style">{{ change.title }}</span>
                            </v-radio>
                        </v-radio-group>
                    </div>
                </div>
            </template>
            <template v-if="selectedSubTab === 'defectTypeOriginal'">
                <div class="mod-filter__filter-container">
                    <div class="title-container">
                        <div class="text text--medium text--secondary-style space-below mod-filter__custom-text">Original Defect Types</div>
                    </div>
                    
                    <div class="mod-filter__tag-container">
                        <v-chip-group v-model="defectTypeOriginal" active-class="selected" column multiple>
                            <v-chip :key="type.id" v-for="type of defectTypeOptions" outlined label :ripple="false" :value="type.id" class="mod-filter__chip">
                                <span class="text text--secondary-style">{{ type.title }}</span>
                            </v-chip>
                        </v-chip-group>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import {mapFields} from 'vuex-map-fields';

export default {
    props: ['selectedSubTab'],
    data() {
        return {
            signboardChanges: [
                { id: "added", title: "Added"},
                { id: "deleted", title: "Deleted"},
                { id: "noChange" , title: "No Change"}
            ],
            modAreas: [
                { id: "signArea", title: "Sign Area"},
                { id: "defect", title: "Defect Area"},
                { id: "noChange" , title: "No Change"}
            ],
            defectSignboardChanges: [
                { id: "defective", title: "Revised as Defective"},
                { id: "normal", title: "Revised as Normal"},
                { id: "noChange", title: "No Change"}
            ],
            defectTypeChanges: [
                { id: true, title: "Yes"},
                { id: false, title: "No"}
            ],
            defectTypeOptions: [
                    {
                        id: "damagedDisplay", 
                        title: "(a) Broken or missing display surface inside structural frames"
                    },
                    {
                        id: "missingDisplay", 
                        title: "(b) No display surface with only structural support attached to other building structure"
                    },
                    {
                        id: "derelict", 
                        title: "(c) Showing obsolete, dilapidated or derelict condition"
                    },
                    {
                        id: "rust",
                        title: "(d) Substantial corrosion with obvious signs such as rusty water marks"
                    },
                    {
                        id: "deformedStructure",
                        title: "(e) Evident structural distortion, deformation, sagging, rupture, loosening and detachment of any of its components"
                    }
                ],
        }
    },
    computed: {
        ...mapFields({
            signboardIdentificationRevised: "record.filter.modification.signboardIdentificationRevised.value",
            boundingAreaRevised: "record.filter.modification.boundingAreaRevised.value",
            defectiveSignboardRevised: "record.filter.modification.defectiveSignboardRevised.value",
            defectTypeModified: "record.filter.modification.defectTypeModified.value",
            defectTypeOriginal: "record.filter.modification.defectTypeOriginal.value"
        })
    }
}
</script>