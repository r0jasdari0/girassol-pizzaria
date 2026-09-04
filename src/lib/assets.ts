/** Caminho de uma foto em public/images, respeitando a base do site (ex.: GitHub Pages em subpasta). */
export const img = (name: string): string => `${import.meta.env.BASE_URL}images/${name}.jpg`;
