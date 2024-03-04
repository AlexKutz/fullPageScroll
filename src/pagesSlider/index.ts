import PagesSlider from "./class.ts";
import './style.css'

export default function initPageSlider(wrapperSelector: string) {
  const wrapper = document.querySelector(wrapperSelector)
  if (wrapper instanceof HTMLDivElement) {
    return new PagesSlider(wrapper)
  } else {
    throw new Error('Invalid arguments')
  }
}