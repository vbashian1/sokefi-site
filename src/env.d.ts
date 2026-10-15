/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /**
     * Set by src/pages/articles/[slug].astro so <Gallery> inside an MDX body can use
     * the validated gallery images (MDX only sees raw frontmatter).
     */
    articleGallery?: import('./types/gallery').ArticleGalleryImage[];
  }
}
