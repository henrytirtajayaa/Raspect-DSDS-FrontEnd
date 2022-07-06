<template>
  <v-card width="210px" class="signboard-list-panel">
    <v-container>
      <v-row>
        <v-col>
          <div class="list__title text">
            {{ computedSignboardList.length }} Results
          </div>
        </v-col>
      </v-row>
      <CommonSignboardListCard
        v-for="signboard in computedSignboardList"
        v-bind:isSelected="signboard._id == computedSelectedSignboard._id"
        v-bind:key="signboard.id"
        @onsignboardselect="onSignboardSelect"
        v-bind:signboard="signboard"
        :isDefective="signboard.signboardType === 'defective'"
      ></CommonSignboardListCard>
    </v-container>
  </v-card>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      signboardFilterRadioItems: [
        { label: "All", value: "A" },
        { label: "With defects", value: "D" }
      ],
      addressFilterRadioItems: [
        { label: "Undefined", value: "U" },
        { label: "Assigned", value: "A" }
      ],
      currentActiveCard: 0
    };
  },
  computed: {
    computedSignboardList() {
      return this.$store.state.signboard.signboardList;
    },
    computedSelectedSignboard () {
      return this.$store.state.signboard.selectedSignboard;
    }
  },
  mounted() {
    this.currentActiveCard = 0
  },
  methods: {
    async onSignboardSelect(signboard) {
      // await this.setResultPanel(false);
      await this.setSelectedSignboard(signboard);
      await this.getSignboardImage({ signboardId: signboard.signboardId });
      await this.getBuildingDetails({ structureId: signboard.structId });
    },
    ...mapMutations({
      setSelectedSignboard: 'signboard/setSelectedSignboard',
      setResultPanel: "signboard/setResultPanel",
    }),
    ...mapActions({
      getSignboardImage: "signboard/getSignboardImage",
      getBuildingDetails: "signboard/getBuildingDetails"
    })
  }
};
</script>
