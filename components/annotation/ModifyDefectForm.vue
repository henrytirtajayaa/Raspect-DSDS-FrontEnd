<template class="save-defect-form">
  <div>
    <div class="save-defect-form__text-container">
      <div class="save-defect-form__add-new-defect-text">Change Defect:</div>
    </div>
    <div>
      <v-select
        dense
        v-model="dropdownVal"
        :items="defectTypes"
        label="select defect type"
        outlined
        hide-details
        item-text="title"
        item-value="id"
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="save-defect-form__defect-container">
      <div class="save-defect-form__defect-id-label">Defect ID:</div>
      <div class="save-defect-form__defect-id-label">N/A</div>
    </div>
    <div>
      <div class="save-defect-form__defect-description-title-container">
        <div class="save-defect-form__defect-id-label">Defect Description:</div>
      </div>
      <div>
        <v-textarea
          v-model="defectDesc"
          outlined
          label="Describe defect"
        ></v-textarea>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="save-defect-form__save-btn-container">
      <v-btn color="white" elevation="0" @click="$emit('cancel-add-defect')"><span class="text text--medium text--bold">Cancel</span></v-btn>
      <v-btn @click="updateValue(dropdownVal)" color="primary" elevation="0" :disabled="dropdownVal == defectType"><span class="text text--medium text--bold text--white">Save</span></v-btn>
    </div>
  </div>
</template>

<script>
import {DEFECT_TYPES} from '../../constants';
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      dropdownVal: "",
      radioChoices: [{ value: "defect" }, { value: "other" }],
      defectDesc: '',
      defectTypes: DEFECT_TYPES
    };
  },
  computed: {
    defectType() {
      return this.$store.state.signboard.selectedSignboard.defectTypes
    },
    selectedDefectObjectId() {
      return this.$store.state.signboard.selectedDefectObjectId
    },
    displayPhotos() {
      return this.$store.state.signboard.selectedSignboard.images
        ? this.$store.state.signboard.selectedSignboard.images
        : [];
    },
    imgId() {
      return this.$store.state.signboard.imageAnnotation.imgId;
    },
    defectList() {
      let photo = this.displayPhotos.find(
        obj => obj._id === this.imgId
      )
      return (photo) ? photo.defectAnnotations : [];
    },
    selectedDefect() {
      let defect = this.defectList.find(
        obj => obj._id === this.selectedDefectObjectId
      )
      return (defect) ? defect : {}
    }
  },
  methods: {
    ...mapMutations({
      setDefectType: "signboard/setDefectType",
      setDefectList: "signboard/setDefectList",
      updateAnnotation: "signboard/updateAnnotation",
    }),
    updateValue(val) {
      this.$emit('save', {
        newDefectType: this.dropdownVal,
        originalDefectType: this.selectedDefect?.defectType
      }); 
      this.setDefectType(val)
      this.dropdownVal = val
      this.setDefectList(this.defectType)
    }
  },
  mounted() {
    this.dropdownVal = this.selectedDefect?.defectType
  }
};
</script>
