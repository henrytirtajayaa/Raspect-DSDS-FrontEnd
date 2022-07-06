<template class="board-details">
  <div>
    <div class="board-details__header-container">
      <div>
        <v-btn fab elevation="0" @click="$emit('set-annotation-mode')">
          <v-icon>
            mdi-chevron-left
          </v-icon>
        </v-btn>
      </div>
      <div>
        Signboard<br />
        BO0008
      </div>
    </div>
    <div>
      <div class="board-details__row">
        <p>Address</p>
        <p>17-19 Mong Kok Road</p>
      </div>
      <div class="board-details__row">
        <p>Building Name</p>
        <p>Yuet Yuen Building</p>
      </div>
      <div class="board-details__row">
        <p>File Reference No.</p>
        <p>4775-62</p>
      </div>
      <div class="board-details__row">
        <p>OP No.</p>
        <p>K263/67</p>
      </div>
      <div class="board-details__row">
        <p>Block Type</p>
        <p>TOW</p>
      </div>
      <div class="board-details__row">
        <p>Floor</p>
        <p>1/F</p>
      </div>
      <div class="board-details__row">
        <p>Date of survey</p>
        <p>14 July 2020</p>
      </div>
    </div>
  </div>
</template>
