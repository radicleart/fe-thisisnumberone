<template>
<div>
</div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from '@stomp/stompjs'

let socket = null
let stompClient = null

const RISIDIO_API_PATH = process.env.VUE_APP_RISIDIO_API

const unsubscribeApiNews = function () {
  if (socket && stompClient) {
    stompClient.disconnect()
  }
}

const subscribeApiNews = function (that) {
  const connectUrl = RISIDIO_API_PATH + '/mesh/api-news'
  if (!socket) socket = new SockJS(connectUrl)
  if (!stompClient) stompClient = Stomp.over(socket)
  stompClient.debug = () => { console.log('debug off') }
  socket.onclose = function () {
    stompClient.disconnect()
  }
  stompClient.connect({}, function () {
    stompClient.subscribe('/queue/mintAllocation-news-' + that.loopRun.currentRunKey, function (response) {
      const allocation = JSON.parse(response.body)
      that.$emit('updateAllocation', allocation)
      that.$notify({ type: 'warning', title: 'Minting', text: 'Reselecting mint targets!' })
    })
  },
  function (error) {
    console.log(error)
  })
}

export default {
  name: 'PunkTracker',
  components: {
  },
  props: ['items', 'loopRun'],
  data: function () {
    return {
      ready: false
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
    unsubscribeApiNews()
  },
  mounted () {
    subscribeApiNews(this)
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
.btn {
  width: inherit;
}
</style>
