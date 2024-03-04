import './style.css'
import PagesSlider from "./pagesSlider";

let pagesSlider

const wrapper = document.querySelector('.pages-slider')

if (wrapper instanceof HTMLDivElement) {
  pagesSlider = new PagesSlider(wrapper)
} else {
  throw new Error('Invalid argument in creating an instance of the PageSlider class')
}

// FIXME: DEV
// @ts-ignore
window.s = pagesSlider
