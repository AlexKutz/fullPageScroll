export interface IPageSlider {
  wrapper: HTMLDivElement
  pages: HTMLElement[]
  currentPageIndex: number
  setPage(index: number): void
}