require('./style.scss')
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'

import Modal from './modal'
import Timer from './timer'
import * as template from './index.vue.html'

interface TimerData {
  start: number
  end: number
}

@Component(template({
  components: { Modal, Timer: Timer }
}))
class App extends Vue {

  timers: TimerData[] = []

  $refs: {
    modal: Modal
  }

  openModal() {
    console.log('clicked')
    const { modal } = this.$refs
    modal.create()
    modal.show = true
  }

  submit({ start, end }: TimerData) {
    this.timers.push({ start, end })
  }

  cancel(start: number) {
    const index = this.timers.findIndex(timer => timer.start === start)
    this.timers.splice(index, 1)
  }
}

const application = new App()

application.$mount('#app')
