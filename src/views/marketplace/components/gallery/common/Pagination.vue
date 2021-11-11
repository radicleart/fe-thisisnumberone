<template>
<div class="d-flex justify-content-center" v-if="doPaging && numberOfItems > pageSize">
  <div class="fixedElement">
  <b-pagination
    class="p-2"
    v-model="currentPage"
    :total-rows="numberOfItems"
    :per-page="pageSize"
    aria-controls="my-table"
    @input="gotoPage"
    pills
    limit="3"
    hide-ellipsis
    last-number
    first-number
  >
    <template v-slot:page="{ page, active }">
      <b v-if="active">{{ page }}</b>
      <i v-else>{{ page }}</i>
    </template>
  </b-pagination>
  </div>
</div>
</template>

<script>
export default {
  name: 'Pagination',
  components: {
  },
  watch: {
    page: function () {
      this.currentPage = this.page
    }
  },
  props: ['numberOfItems', 'pageSize'],
  data () {
    return {
      page: 0,
      doPaging: true,
      currentPage: 1
    }
  },
  methods: {
    gotoPage () {
      this.$emit('changePage', this.currentPage)
    }
  },
  computed: {
  }
}
</script>
<style>
.page-item .page-link {
    background-color: #212121 !important;
    border-color: #212121 !important;
    color: #fff !important;
}
.page-item.disabled .page-link {
  background-color: #212121 !important;
  border-color: #212121 !important;
  color: #fff !important;
}
.page-item.active .page-link {
    color: #212121 !important;
    background-color: #ffd54f !important;
    border-color: #ffd54f !important;
}
.page-item:last-child .page-link {
    border-color: #212121 !important;
    background-color: #212121 !important;
    color: #fff !important;
}
.page-item:first-child .page-link {
    border-color: #212121 !important;
    background-color: #212121 !important;
    color: #fff !important;
}

</style>
