import EventEmitter from './eventEmmiter.ts'
import {IPageSlider} from './interface.ts'


export default class FullPageScroll extends EventEmitter implements IPageSlider{
  readonly wrapper: HTMLDivElement
  readonly pages: HTMLElement[]
  readonly #animationDuration: number = 400
  #frozen: boolean = false
  currentPageIndex: number = 0

  constructor(wrapper: HTMLDivElement) {
    super()
    this.wrapper = wrapper
    this.pages = Array.from(this.wrapper.children) as HTMLDivElement[]
    if (!this.pages) throw new Error('Pages must be in a pages-wrapper before initialization')
    this.pages.slice(1).forEach(page => page.style.visibility = 'hidden')
    this.#animationDuration = Number.parseFloat(getComputedStyle(this.wrapper).transitionDuration) * 1000
    this.#addListeners()
  }

  setPage(index: number) {
    if (this.#frozen || index === this.currentPageIndex ||
      index > this.pages.length - 1 || index < 0) {
      return
    }
    let previousPage = this.currentPageIndex
    this.currentPageIndex = index
    this.pages[index].style.visibility = 'visible'
    this.wrapper.style.transform = `translateY(-${index * 100}%)`
    this.#frozen = true
    this.emit('changePage', {nextPage: index, previousPage})
    setTimeout(
      () => {
        this.#setFocus(this.pages[this.currentPageIndex])
        this.pages[previousPage].style.visibility = 'hidden'
        this.#frozen = false
      }, this.#animationDuration)
  }

  #nextPage = () => {
    const page = this.pages[this.currentPageIndex]
    if (page.scrollTop > page.scrollHeight - page.clientHeight - 1) {
      this.setPage(this.currentPageIndex + 1)
    }
  }

  #previousPage = () => {
    if (this.pages[this.currentPageIndex].scrollTop < 1) {
      this.setPage(this.currentPageIndex - 1)
    }
  }

  #setFocus(page: HTMLElement) {
    const focusable = getFirstFocusable(page)
    if (focusable !== null) {
      focusable.focus({preventScroll: true})
      return
    } else {
      page.tabIndex = 0
      page.focus()
    }
  }

  #addListeners() {
    addEventListener('wheel', (event) => {
      if (event.deltaY < 0) {
        this.#previousPage()
      } else if (event.deltaY > 0) {
        this.#nextPage()
      }
    })

    let lastEvent: TouchEvent
    addEventListener('touchmove', (event) => {
      if (!lastEvent || event.timeStamp - lastEvent.timeStamp > 100) {
        lastEvent = event
        return
      }
      let currentY = event.targetTouches[0].clientY;
      let lastY = lastEvent.targetTouches[0].clientY
      console.log(currentY - lastY < -10)
      if (currentY - lastY > 15) {
        this.#previousPage()
      } else if (currentY - lastY < -10) {
        this.#nextPage()
      }
      lastEvent = event;
    })

    addEventListener('keydown', (event) => {
      if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return
      switch (event.code) {
        case 'ArrowUp':
        case 'PageUp':
        case 'Home':
          this.#previousPage()
          break
        case 'ArrowDown':
        case 'PageDown':
        case 'End':
          this.#nextPage()
          break
      }
    })
  }
}

function getFirstFocusable(target: HTMLElement): HTMLElement | null {
  return target.querySelector(
    'a[href], button, input, textarea, select, details, [tabindex="0"]',
  )
}