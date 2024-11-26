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
