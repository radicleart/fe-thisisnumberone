<template>
<div>
  <div><span class="" v-html="displayable"></span>
  <span v-if="overflow && morable" class="text-muted">
    <a href="" class="text-warning px-2" @click.prevent="truncated = !truncated" v-if="truncated" >read more</a>
    <a href="" class="text-warning px-2" @click.prevent="truncated = !truncated" v-else>less</a>
  </span>
  </div>
</div>
</template>

<script>

// noinspection JSUnusedGlobalSymbols
export default {
  name: "DescriptionContainer",
  components: {
  },
  props: ["text", "limit", "morable"],
  data() {
    return {
      truncated: true,
    };
  },
  mounted() {
  },
  computed: {
    displayable() {
      let splittedLength = 0;
      if (this.text) {
        splittedLength = this.text.split(" ").length;
      }
      if (splittedLength > this.limit && this.truncated) {
        let words = this.text.split(" ");
        let limit = words.length - 1;
        let trunc = Math.min(limit, this.limit);
        let truncStr = words.slice(0,trunc);
        return truncStr.join(" ");
      } else {
        return this.text;
      }
    },
    overflow() {
      let splittedLength = 0;
      if (this.text) {
        splittedLength = this.text.split(" ").length;
      }
      return splittedLength > this.limit;
    }
  },
  methods: {
  }
};
</script>
<style>

</style>
<style scoped>
</style>
