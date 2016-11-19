import * as Vue from 'vue'
import { Component, prop } from 'vue-property-decorator'

import * as template from './modal.vue.html'

@Component(template({}))
export default class Modal extends Vue {

  hours = 0

  minutes = 0

  seconds = 0

  show = false

  create() {
    this.hours = 0
    this.minutes = 0
    this.seconds = 0
  }

  submit() {
    const start = new Date().getTime()
    const end = start + (((this.hours * 60 + this.minutes) * 60) + this.seconds) * 1000
    this.$emit('submit', { start, end })
    this.show = false
  }

  cancel() {
    this.show = false
  }
}
