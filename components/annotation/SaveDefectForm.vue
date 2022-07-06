<template class="save-defect-form">
  <v-form ref="form" v-model="valid">
    <div class="save-defect-form__text-container">
      <div class="save-defect-form__add-new-defect-text">Add New Defect:</div>
    </div>
    <div>
      <v-select
        dense
        v-model="dropdownVal"
        :items="defectTypes"
        label="select defect type"
        outlined
        item-text="title"
        item-value="id"
        :rules="[rules.required]"
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
      <v-btn @click="saveDefect(dropdownVal)" color="primary" elevation="0" :loading="isLoading"><span class="text text--medium text--bold text--white">Save</span></v-btn>
    </div>
  </v-form>
</template>

<script>
import {DEFECT_TYPES} from '../../constants';

export default {
  data() {
    return {
      dropdownVal: "",
      defectDesc: "",
      radioChoices: [{ value: "defect" }, { value: "other" }],
      defectTypes: DEFECT_TYPES,
      rules: {
        required: value => !!value || "Required",
      },
      valid: false,
      isLoading: false
    };
  },
  methods: {
    toggleLoading() {
      this.isLoading = !this.isLoading;
    },
    async saveDefect(damageType) {
      await this.$refs.form.validate();
      if (this.valid === true) {
        this.isLoading = true;
        this.$emit('save', damageType, () => this.toggleLoading());
      }
    }
  }
};
</script>
