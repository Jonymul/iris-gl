import { useEffect, useState } from "react";

export const useTempGetImageData = (
  imageUrl: string
): HTMLImageElement | undefined => {
  const [imageData, setImageData] = useState<HTMLImageElement>();

  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";

    img.src = imageUrl;
    img.addEventListener("load", () => {
      setImageData(img);
    });
  }, [imageUrl, setImageData]);

  return imageData;
};
