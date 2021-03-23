import Vue from 'vue'

const notify = {
  info (note) {
    Vue.notify({
      duration: 6000,
      type: 'success',
      group: 'artwork-actions',
      title: note.title,
      text: note.text
    })
  },
  warn (note) {
    Vue.notify({
      duration: 6000,
      type: 'warn',
      group: 'artwork-actions',
      title: note.title,
      text: note.text
    })
  },
  error (note) {
    Vue.notify({
      duration: 12000,
      closeOnClick: true,
      type: 'error',
      group: 'artwork-actions',
      title: note.title,
      text: note.text
    })
  }
}

export default notify
