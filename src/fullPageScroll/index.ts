import Slider from "./slider.ts";
import './style.css'

function initPageSlider(wrapperSelector: string) {
  let container = document.querySelector(wrapperSelector)
  if (container instanceof HTMLDivElement) {
    return new Slider(container)
  } else throw new Error('Invalid HTML')
}

export type { IPageSlider } from './interface.ts'
export default initPageSlider
