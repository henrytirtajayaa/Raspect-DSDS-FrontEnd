<template>
    <div id="map-wrap" class="d-flex signboard-map">
        <template v-if="signboardLocation">
            <SingleMap :location="signboardLocation" @markerselected="onMarkerSelected"></SingleMap>
        </template>
        <CommonSignboardDetail
            fromSingleMap
            v-bind:showSignboardDetail="showSignboardDetail"
            @closebtnclick="closeButtonClick"
        >
        </CommonSignboardDetail>
    </div>
</template>
<script>
import {mapActions} from "vuex";

export default {
    data() {
        return {
            showSignboardDetail: false
        }
    },
    methods: {
        onMarkerSelected() {
            this.showSignboardDetail = true;
        },
        ...mapActions({
            getSignboardData: "signboard/getSignboardData",
        }),
        closeButtonClick() {
            this.showSignboardDetail = false;
        },
    },
    async mounted() {
        await this.getSignboardData({ accessToken: window.localStorage.getItem('accessToken'), signboardId: this.$route.params.signboardId});
        this.showSignboardDetail = true;
    },
    computed: {
        selectedSignboard() {
            return this.$store.state.signboard.selectedSignboard;
        },
        signboardLocation() {
            return this.$store.state.signboard.selectedSignboard && this.$store.state.signboard.selectedSignboard.location && this.$store.state.signboard.selectedSignboard.location.coordinates ?  [this.$store.state.signboard.selectedSignboard.location.coordinates[1], this.$store.state.signboard.selectedSignboard.location.coordinates[0]] : "";
        }
    }
}
</script>