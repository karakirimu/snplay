import React, { useEffect, useRef } from 'react';
import { Box, VStack, Text, Image } from "@chakra-ui/react";
import { Button } from './ui/button';
import { handleOpenFolder } from '@/functions/FileHandler';

interface SidebarProps {
  images: string[];
  selectedImageIndex: number | null;
  onImageClick: (imageSrc: string, index: number) => void;
  onFolderSelect: (files: FileList) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ images, selectedImageIndex, onImageClick, onFolderSelect }) => {
  const selectedImageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedImageRef.current) {
      selectedImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedImageIndex]);

  return (
    <Box as="aside" bg="gray.800" borderRight={"1px solid gray.950"} minW="200px" maxW="200px" p={4} minH="calc(100vh - 40px)" maxH="calc(100vh - 40px)" overflowY="auto">
      <VStack align="start" gap={4}>
        {images.length > 0 ? (
          images.map((src, index) => (
            <Box
              key={index}
              onClick={() => onImageClick(src, index + 1)}
              cursor="pointer"
              p={2}
              borderRadius="md"
              bg={(selectedImageIndex !== null && index + 1 === selectedImageIndex) ? "gray.700" : "transparent"}
              w="100%"
              _hover={{ bg: "gray.600" }}
              ref={(selectedImageIndex !== null && index + 1 === selectedImageIndex) ? selectedImageRef : null}
            >
              <VStack align="start" gapY={1}>
                <Text>{index + 1}</Text>
                <Image key={`thumbnail-${index}`} src={src} alt={`image-${index}`} />
              </VStack>
            </Box>
          ))
        ) : (
          <Button variant={"subtle"} onClick={() => handleOpenFolder({ onFolderSelect })}>Open Folder...</Button>
        )}
      </VStack>
    </Box>
  );
};

export default Sidebar;