import { Dimensions } from "@iris/core";

export function calculateCoverScaleFactor(
  containerDimensions: Dimensions,
  contentDimensions: Dimensions
) {
  const heightRatio = containerDimensions.height / contentDimensions.height;
  const widthRatio = containerDimensions.width / contentDimensions.width;
  return Math.min(1, heightRatio, widthRatio);
}
