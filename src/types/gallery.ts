/** A gallery image as resolved by the article page, ready for <Gallery pick={[…]} />. */
export interface ArticleGalleryImage {
  src: string;
  width: number;
  height: number;
  landscape: boolean;
  isLastOdd: boolean;
  /** The original file's path, for the web-sized copies (src/utils/responsiveImage.ts). */
  fsPath?: string;
}
