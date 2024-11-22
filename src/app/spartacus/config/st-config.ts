import { LayoutConfig } from "@spartacus/storefront";

export const stLayoutConfig: LayoutConfig = {
  layoutSlots: {
    CartPageTemplate: {
      slots: [
        'TopContent',
        'CenterRightContentSlot',
        'EmptyCartMiddleContent',
        'BottomContentSlot',
      ],
    },
  },
};
