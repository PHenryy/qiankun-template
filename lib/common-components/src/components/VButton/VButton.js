import './VButton.styl'

export default {
  name: 'VButton',
  render(h) {
    return h('button', this.$slots.default)
  },
}
