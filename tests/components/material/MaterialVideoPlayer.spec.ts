import { nextTick, ref } from 'vue'
import MaterialVideoPlayer from '@/components/material/MaterialVideoPlayer.vue'
import { mountWithVuetify } from '@/tests/utils/mountWithVuetify'

describe('MaterialVideoPlayer', () => {
  it('toggles play/pause internal state and emits mute updates', async () => {
    const wrapper = mountWithVuetify(MaterialVideoPlayer, {
      props: { src: 'about:blank' },
      attachTo: document.body,
    })

    const playBtn = wrapper.get('[aria-label="PlayPause"]')
    await playBtn.trigger('click')
    await nextTick()
    // second click to pause
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
    const wrapper = mountWithVuetify(MaterialVideoPlayer, {
      attachTo: document.body,
      props: {
        src: 'about:blank',
        modelValue: playing.value,
        'onUpdate:modelValue': (v: boolean) => (playing.value = v),
      },
    })
    // stub play/pause which are not implemented in JSDOM
    const vid = wrapper.find('video').element as HTMLVideoElement
    vid.play = async () => {}
    vid.pause = () => {}
    const playBtn = wrapper.get('[aria-label="PlayPause"]')
    await playBtn.trigger('click')
    await nextTick()
    expect(playing.value).toBe(true)
    wrapper.unmount()
  })
})
