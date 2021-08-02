<template>
<b-container>
  <b-row class="my-5">
    <b-col>
      <h1>Your request has been recieved</h1>
      <p>Our team will be in touch shortly!</p>
    </b-col>
  </b-row>
  <b-row class="vh-50" align-v="end">
    <b-col md="6" sm="12">
      <h1>Collaborate</h1>
      <p>Collaboration is the process of two or more people, entities or organizations working together to complete a task or achieve a goal.[1] Collaboration is similar to cooperation. Most collaboration requires leadership,[vague] although the form of leadership can be social within a decentralized and egalitarian group.[2] Teams that work collaboratively often access greater resources, recognition and rewards when facing competition for finite resources.[3]</p>
    </b-col>
    <b-col md="6" sm="12">
      <div class="center-me bg-danger text-center">
        <div class="text-center">
          <div style="font-size: 8rem;" ><b-icon icon="check-circle"/></div>
          <p>Thank you for your interest in Number One</p>
        </div>
      </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>

export default {
  name: 'PendingExhibitRequest',
  components: {
  },
  props: ['referer'],
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
