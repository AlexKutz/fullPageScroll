import './style.css'

export default class PagesSlider {
  wrapper: HTMLDivElement
  #pagesRibbon!: HTMLDivElement
  #currentPageIndex: number = 0
  #waitForAnimation: boolean = false
  #pages!: HTMLElement[]
  #animationDuration: number = 400

  constructor(wrapper: HTMLDivElement) {
    this.wrapper = wrapper
    this.init()
    this.addListeners()
  }

  setPage(index: number) {
    let previousPage = this.#currentPageIndex
    if (this.#waitForAnimation || index === this.#currentPageIndex ||
      index > this.#pages.length - 1 || index < 0) { return }
    this.#pages[index].style.visibility = 'visible'
    this.#pagesRibbon.style.transform = `translateY(-${index * 100}%)`
    this.#currentPageIndex = index
    this.#waitForAnimation = true
    setTimeout(() => {
      this.setPageFocus(this.#pages[this.#currentPageIndex])
      this.#pages[previousPage].style.visibility = 'hidden'
      this.#waitForAnimation = false
    }, this.#animationDuration)
  }

  setPageFocus(page: HTMLElement) {
    const focusable = getFirstFocusable(page)
    if (focusable !== null) {
      focusable.focus()
      return
    }
    page.tabIndex = 0
    page.focus()
  }

  nextPage() {
    this.setPage(this.#currentPageIndex + 1)
  }

  previousPage() {
    this.setPage(this.#currentPageIndex - 1)
  }

  isScrollTop() {
    return this.#pages[this.#currentPageIndex].scrollTop < 1
  }

  isScrollBottom() {
    const page = this.#pages[this.#currentPageIndex]

    return page.scrollTop > page.scrollHeight - page.clientHeight - 1
  }

  addListeners() {
    onwheel = (event) => {
      if (event.deltaY < 0 && this.isScrollTop()) {
        this.previousPage()
      }
      else if (event.deltaY > 0 && this.isScrollBottom()) {
        this.nextPage()
      }
    }

    let lastEvent: TouchEvent
    addEventListener('touchmove', (event) => {
      if (!lastEvent || event.timeStamp - lastEvent.timeStamp > 100) {
        lastEvent = event
        return
      }
      let currentY = event.targetTouches[0].clientY;
      let lastY = lastEvent.targetTouches[0].clientY
      if (currentY > lastY && this.isScrollTop()) {
        this.previousPage()
      } else if (currentY < lastY && this.isScrollBottom()) {
        this.nextPage()
      }
      lastEvent = event;
    })

    addEventListener('keydown', (event) => {
      const key = event.code
      if (key === 'ArrowUp' && this.isScrollTop()) {
        this.previousPage()
        return
      }
      if (key === 'ArrowDown' && this.isScrollBottom()) {
        this.nextPage()
      }
    })
  }

  init() {
    const ribbon = this.wrapper.firstElementChild
    if (ribbon !== null && ribbon instanceof HTMLDivElement) {
      this.#pagesRibbon = ribbon
    } else {
      throw new Error('Incorrect HTML layout')
    }

    ribbon.style.transitionDuration = getComputedStyle(ribbon).transitionDuration

    this.#pages = Array.from(ribbon.children) as HTMLDivElement[]

    this.#pages.slice(1).forEach(page => page.style.visibility = 'hidden')

  }
}

function getFirstFocusable(target: HTMLElement): HTMLElement | null {
  return target.querySelector(
    'a[href], button, input, textarea, select, details, [tabindex="0"]',
  )
}