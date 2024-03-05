import './style.css'
import initPageSlider from "./fullPageScroll";

const slider = initPageSlider('.pages-wrapper')

// slider.on('changePage', (args: {}) => {console.log(args)})
// new Controls(slider)

// FIXME: DEV
// @ts-ignore
window.s = slider
