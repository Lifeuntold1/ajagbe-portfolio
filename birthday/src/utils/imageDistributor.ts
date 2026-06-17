export function getImagesForPage(pageNumber: number): string[] {
  // We have 55 images and 24 pages.
  // 55 / 24 = 2.29.
  // We can assign 2 images to most pages, and 3 images to some pages to distribute 55 evenly.
  // Pages 1-7 get 3 images (21 total). Pages 8-24 get 2 images (34 total). 21 + 34 = 55 images.
  // Let's calculate the start index based on this.

  if (pageNumber < 1 || pageNumber > 24) {
    return [];
  }

  const images: string[] = [];
  let startIndex = 1;

  for (let i = 1; i < pageNumber; i++) {
    const count = i <= 7 ? 3 : 2;
    startIndex += count;
  }

  const countForThisPage = pageNumber <= 7 ? 3 : 2;

  for (let i = 0; i < countForThisPage; i++) {
    const imageIndex = startIndex + i;
    if (imageIndex <= 55) {
      // Assuming images are in public/images/ or src/assets/images/
      // User says: "The local assets folder contains exactly 55 images named `bukky (1).jpeg` through `bukky (55).jpeg`."
      // In Vite, images in `public/images` can be referenced as `/images/bukky (X).jpeg`
      images.push(`${import.meta.env.BASE_URL}images/bukky (${imageIndex}).jpeg`);
    }
  }

  return images;
}
