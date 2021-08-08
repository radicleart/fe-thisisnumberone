<template>
<b-container>
  <b-row class="my-5" style="min-height: 32vh;">
    <b-col md="4" sm="12" align-self="end">
      <PrismicItems :prismicItems="content.allset"/>
    </b-col>
    <b-col md="8" sm="12" class="mt-4 bg-success p-5 text-center">
        <div class="mt-5 text-center">
          <div style="font-size: 8rem;" ><b-icon icon="check-circle"/></div>
          <p>Thank you for your interest in Number One</p>
        </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import PrismicItems from '@/components/prismic/PrismicItems'

export default {
  name: 'ExhibitRequestAllSet',
  components: {
    PrismicItems
  },
  props: ['content'],
  data: function () {
    return {
    }
  },
  watch: {
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
.center-me {
  padding-top: 100px;
  border: none;
  display: flexbox;
  height: 350px;
  width: 350px;
  align-items: center;
}

</style>
