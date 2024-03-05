import PagesSlider from "./Slider.ts";
import './style.css'

function initPageSlider(wrapperSelector: string) {
  let container = document.querySelector(wrapperSelector)
  if (container instanceof HTMLDivElement) {
    return new PagesSlider(container)
  } else throw new Error('Invalid HTML')
}

export default initPageSlider