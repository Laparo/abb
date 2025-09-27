import { nextTick, ref } from 'vue'
import MaterialAudioPlayer from '@/components/material/MaterialAudioPlayer.vue'
import { mountWithVuetify } from '@/tests/utils/mountWithVuetify'

describe('MaterialAudioPlayer', () => {
  it('toggles play/pause internal state and emits mute updates', async () => {
    const wrapper = mountWithVuetify(MaterialAudioPlayer, {
      props: { src: 'about:blank' },
      attachTo: document.body,
    })

    const playBtn = wrapper.get('[aria-label="PlayPause"]')
    await playBtn.trigger('click')
    await nextTick()
    await playBtn.trigger('click')
    await nextTick()

    const muteBtn = wrapper.get('[aria-label="MuteToggle"]')
    await muteBtn.trigger('click')
    const emitted = wrapper.emitted('update:muted')
    expect(emitted && emitted.length).toBeGreaterThan(0)

    wrapper.unmount()
  })

  it('works in controlled mode via v-model', async () => {
    const playing = ref(false)
    const wrapper = mountWithVuetify(MaterialAudioPlayer, {
      attachTo: document.body,
      props: {
        src: 'about:blank',
        modelValue: playing.value,
        'onUpdate:modelValue': (v: boolean) => (playing.value = v),
      },
    })
    const audio = wrapper.find('audio').element as HTMLAudioElement
    audio.play = async () => {}
    audio.pause = () => {}
    const playBtn = wrapper.get('[aria-label="PlayPause"]')
    await playBtn.trigger('click')
    await nextTick()
    expect(playing.value).toBe(true)
    wrapper.unmount()
  })
})
