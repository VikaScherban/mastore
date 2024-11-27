import { Image, ImageGroup, Product } from '@spartacus/core';
import { MediaContainer } from '@spartacus/storefront';

export function getMedia(product: Product): MediaContainer
  | Image
  | ImageGroup
  | ImageGroup[]
  | undefined {
  // @ts-ignore
  return product?.images?.PRIMARY;
}

export function getImage(product: Product): string {
  // @ts-ignore
  return (product.images?.[0] as ImageGroup)?.url as string;
}

