<template>
<section id="adminSection" style="min-height: 100vh;">
  <div class="text-white container">
    <registry/>
  </div>
</section>
</template>

<script>
import Registry from '@/components/admin/Registry'

export default {
  name: 'Admin',
  components: {
    Registry
  },
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>
</style>
