import { useState } from 'react';
import { HStack } from "@chakra-ui/react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageLastIndex, setImageLastIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageSrc: string, index: number) => {
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
  };
  
  const handleIndexClick = (index: number) => {
    if(index < 1 || index > images.length) {
      return;
    }
    const imageSrc = images[index - 1];
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
  };

  const handleFolderSelect = (files: FileList) => {
    if(images.length > 0) {
      images.forEach(URL.revokeObjectURL);
      setImages([]);
    }

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const imageUrls = imageFiles.map(file => URL.createObjectURL(file));
    setImageLastIndex(imageUrls.length);
    setImages(imageUrls);
    handleImageClick(imageUrls[0], 1);
  };

  return (
    <>
      <Header onFolderSelect={handleFolderSelect}
              onIndexChange={handleIndexClick}
              selectedIndex={selectedImageIndex}
              lastImageIndex={imageLastIndex}/>
      <HStack align="start" p={0} m={0} gap={0}>
      <Sidebar images={images} selectedImageIndex={selectedImageIndex} onImageClick={handleImageClick} onFolderSelect={handleFolderSelect} />
      {selectedImage && <Canvas imageSrc={selectedImage} />}
      </HStack>
    </>
  );
}

export default App;