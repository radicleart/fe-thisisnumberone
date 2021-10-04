<template>
  <div>
  </div>
</template>
<script>

export default {
  name: 'MessageTicker',
  props: ['tickerId'],
  data () {
    return {
      ticker: null,
      otherMessages: [
        { sayer: '', saying: 'Stillness in the midst of chaos' },
        { sayer: '', saying: 'Loopy De Loop' },
        { sayer: '', saying: 'Provably scarce' },
        { sayer: '', saying: 'Significantly meaningless' },
        { sayer: '', saying: 'NFT slot machine' },
        { sayer: '', saying: 'I love the smell of loopbombs in the morning' },
        { sayer: '', saying: 'Relentlessly random' },
        { sayer: '', saying: 'One-of-a-kind' },
        { sayer: '', saying: 'Out of confusion, towards clarity...' },
        { sayer: '', saying: 'Double, double toil and trouble' },
        { sayer: '', saying: 'Ultra-rare' },
        { sayer: '', saying: 'You\'ve got Maelstrom!' },
        { sayer: '', saying: 'Get lucky with Art!' }
      ],
      messages: [
        { sayer: 'Plato', saying: 'Thinking: the talking of the soul with itself.' },
        { sayer: 'Plato', saying: 'The greatest wealth is to live content with little.' },
        { sayer: 'Plato', saying: 'Love is a serious mental disease.' },
        { sayer: 'Wilde', saying: 'Be yourself; everyone else is already taken.' },
        { sayer: 'Wilde', saying: 'We are all in the gutter, but some of us are looking at the stars.' },
        { sayer: 'Wilde', saying: 'Some cause happiness wherever they go; others whenever they go.' },
        { sayer: 'Feynman', saying: 'The first principle is that you must not fool yourself and you are the easiest person to fool.' },
        { sayer: 'Feynman', saying: 'Physics is like sex: sure, it may give some practical results, but that\'s not why we do it.' },
        { sayer: 'Feynman', saying: 'What I cannot create, I do not understand.' },
        { sayer: 'Heraclitus', saying: 'There is nothing permanent except change.' },
        { sayer: 'Arendt', saying: 'Forgiveness is the key to action and freedom.' },
        { sayer: 'Arendt', saying: 'Action without a name, a who attached to it, is meaningless.' },
        { sayer: 'Lennon', saying: 'Life is what happens while you are busy making other plans.' },
        { sayer: 'Wittgenstein', saying: 'A nothing will do as well as a something about which nothing can be said.' },
        { sayer: 'Hume', saying: 'Beauty in things exists in the mind which contemplates them.' }
      ]
    }
  },
  beforeMount () {
    if (!this.tickerId) return
    // document.getElementById(this.tickerId).innerHTML = this.getRandomMessage()
    let rolls = 0
    let counter = 0
    document.getElementById(this.tickerId).innerHTML = this.otherMessages[counter].saying
    const $self = this
    this.ticker = setInterval(function () {
      rolls++
      counter = Math.floor(Math.random() * $self.otherMessages.length)
      document.getElementById($self.tickerId).innerHTML = $self.otherMessages[counter].saying
      if (rolls === $self.otherMessages.length * 4) {
        clearInterval($self.ticker)
      }
    }, 1500)
  },
  methods: {
    getRandomMessage () {
      // const index = Math.floor(Math.random() * this.messages.length)
      // let message = '<span style="padding: 10px 30px; font-size: 1.0rem; font-style: italic;">\"' + this.messages[index].saying + '\"</span>'
      // message += '<span style="margin: 10px 80px; font-size: 0.8rem;"><br/>' + this.messages[index].sayer + '</span>'
      return 'message'
    }
  },
  computed: {
  }
}
</script>
<style>
</style>
