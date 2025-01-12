import React, { useEffect, useRef } from 'react';
import { Box, VStack, Text, Image, HStack } from "@chakra-ui/react";
import { Button } from './ui/button';
import { FileAttribute } from '@/types/FileAttribute';
import { importSnConfig, SnConfig } from '@/types/SnConfig';
import { Property } from '@/functions/useProperty';
import { SourceMap } from '@/types/SourceMap';

interface SidebarProps {
  images: Property<SourceMap[]>;
  selectedIndex: Property<number>;
  config: Property<SnConfig>;
  onClick: (index: number) => void;
  onImport: (config: SnConfig) => void;
  onHomeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ images, selectedIndex, onClick, onImport, onHomeClick }) => {
  const selectedImageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedImageRef.current) {
      selectedImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedIndex]);

  return (
    <Box as="aside" bg="gray.800" borderRight={"1px solid gray.950"} minW="220px" maxW="220px" p={4} minH="calc(100vh - 48px)" maxH="calc(100vh - 48px)" overflowY="auto">
      <VStack align="start" gap={4}>
        {images.get().length > 0 ? (
          <>
          <Button w={"full"} variant={"outline"} onClick={() => onHomeClick()}>Home</Button>
          {images.get().map((im, index) => (
            <ImageItem
              key={im.src.objectURL}
              id={im.src.objectURL}
              index={index}
              src={im.src}
              selectedImageIndex={selectedIndex.get()}
              onClick={onClick}
              selectedImageRef={selectedImageRef}
            />
          ))}
          </>
        ) : (
          <Button variant={"subtle"} onClick={() => importSnConfig(onImport)}>Open playlist</Button>
        )}
      </VStack>
    </Box>
  );
};

interface ImageItemProps {
  id: string;
  index: number;
  src: FileAttribute;
  selectedImageIndex: number | null;
  onClick: (index: number) => void;
  selectedImageRef: React.RefObject<HTMLDivElement>;
}

const ImageItem: React.FC<ImageItemProps> = ({ id, index, src, selectedImageIndex, onClick, selectedImageRef }) => {

  return (
    <HStack
      id={id}
      key={index}
      gap={2}
      alignItems={"start"}
      maxW={"100%"}
    >
      <Text w={`${index.toString().length + 1}ch`}>{index + 1}</Text>
      <Box
        key={index}
        onClick={() => onClick(index + 1)}
        cursor="pointer"
        p={2}
        borderRadius="md"
        maxW={"100%"}
        bg={(selectedImageIndex !== null && index + 1 === selectedImageIndex) ? "gray.700" : "transparent"}
        _hover={{ bg: "gray.600" }}
        ref={(selectedImageIndex !== null && index + 1 === selectedImageIndex) ? selectedImageRef : null}
      >
        <VStack align="center" gapY={1}>
          <Image key={`thumbnail-${index}`} src={src.objectURL} alt={`image-${index}`} />
          <Text whiteSpace={"pre-wrap"} wordBreak={"break-all"} maxW={"100%"}>{src.name}</Text>
        </VStack>
      </Box>
    </HStack>
  );
};

export default Sidebar;