// Data/imageData.js

// Data/imageData.js
import imageList from "./images.json"; // Assuming images.json is in the same Data/ folder

const images = imageList.map(img => {
  const newImageUrl = `/assetspictest/${img.imageUrl}`;

  return {
    ...img,
    imageUrl: newImageUrl
  };
});

export default images;