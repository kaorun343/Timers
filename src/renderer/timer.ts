import * as Vue from 'vue'
import { Component, prop } from 'vue-property-decorator'

import { remote } from 'electron'
const { Menu } = remote

import * as template from './timer.vue.html'

export const enum DisplayType {
  RemainingTime,
  EndTime
}

declare class Notification {
  constructor(title: string, options?: { body: string })
}

function toInt(n: number) {
  return Math.floor(n)
}

function zero(n: number) {
  return `0${n}`.slice(-2)
}

function format(h: number, m: number, s: number) {
  return `${zero(h)}:${zero(m)}:${zero(s)}`
}

@Component(template<TimerComponent>({
  mounted() {
    this.interval = setInterval(() => {
      this.update()
    }, 200)
  }
}))
export default class TimerComponent extends Vue {
  title = ''

  displayType = DisplayType.RemainingTime

  willNotify = true
  notified = false

  interval: any = 0

  @prop({ type: null })
  readonly start: number

  @prop({ type: null })
  readonly end: number

  current = (new Date()).getTime()

  get range() {
    const denom = this.end - this.start
    const num = this.end - this.current
    return `${(1 - num / denom) * 100}%`
  }

  get time() {
    return this.displayType === DisplayType.RemainingTime ? this.formatRemaining() : this.formatEnd()
  }

  formatRemaining() {
    const diff = Math.max(this.end - this.current, 0) / 1000
    const h = toInt(diff / 3600)
    const m = toInt((diff % 3600) / 60)
    const s = toInt(diff % 60)
    return format(h, m, s)
  }

  formatEnd() {
    const date = new Date(this.end)
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    return format(h, m, s)
  }

  contextmenu(e: MouseEvent) {
    e.preventDefault()

    const vm = this

    const menu = Menu.buildFromTemplate([
      {
        label: '1分前に通知',
        type: 'checkbox',
        checked: vm.willNotify,
        click() { vm.willNotify = !vm.willNotify }
      },
      { type: 'separator' },
      {
        label: '表示形式', submenu: [
          {
            label: '残り時間',
            type: 'checkbox',
            checked: vm.displayType === DisplayType.RemainingTime,
            click() { vm.displayType = DisplayType.RemainingTime }
          },
          {
            label: '終了時刻',
            type: 'checkbox',
            checked: vm.displayType === DisplayType.EndTime,
            click() { vm.displayType = DisplayType.EndTime }
          }
        ]
      },
      { type: 'separator' },
      { label: 'キャンセル', click() { vm.cancel() } }
    ])
    menu.popup(remote.getCurrentWindow())
  }

  notify() {
    if (this.willNotify) {
      this.notified = true
      const title = this.title.length > 0 ? this.title : '名称未設定'
      new Notification(title, { body: '1分後に終了します。' })
    }
  }

  cancel() {
    clearInterval(this.interval)
    this.$emit('cancel', this.start)
  }

  update() {
    this.current = (new Date()).getTime()

    if (this.end - this.current < 60000) {
      if (!this.notified) {
        this.notify()
      }

      if (Math.min(this.end - this.current, 0) < 0) {
        this.cancel()
      }
    }
  }
}
