require('./style.scss')
import * as Vue from 'vue'
import { Component } from 'vue-property-decorator'

import Timer from './timer'
import * as template from './index.vue.html'

@Component(template({
  components: { Timer }
}))
class App extends Vue {

  timers: { start: number, end: number }[] = []

  add() {
    const start = (new Date()).getTime()
    const end = (new Date()).getTime() + 1000 * 60 * 1.5

    this.timers.push({ start, end })
  }

  cancel(start: number) {
    const index = this.timers.findIndex(timer => timer.start === start)
    this.timers.splice(index, 1)
  }
}

const application = new App()

application.$mount('#app')
