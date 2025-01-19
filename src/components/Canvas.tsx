import { SnConfig } from '@/types/SnConfig';
import { SourceMap } from '@/types/SourceMap';
import { Box, Flex, HStack } from '@chakra-ui/react';
import React, { useRef, useEffect, useCallback } from 'react';
import CaptionCard from './CaptionCard';

type CanvasProps = {
  imageSrc: SourceMap[];
  index: number;
  config: SnConfig;
}

const Canvas: React.FC<CanvasProps> = ({ imageSrc, index, config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataIndex = index - 1;
  const selected = dataIndex !== -1 && config ? config.getSource(dataIndex) : undefined;

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context && imageSrc && dataIndex !== -1) {
      const image = new Image();
      image.src = imageSrc[dataIndex].src.objectURL;
      image.onload = () => {
        const maxWidth = window.innerWidth - 200; // Adjust for sidebar width
        const maxHeight = window.innerHeight - 40; // Adjust for header height
        let width = image.width;
        let height = image.height;

        // Scale image to fit within the canvas
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const scale = Math.min(widthRatio, heightRatio);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
      };
    }

  }, [dataIndex, imageSrc]);

  useEffect(() => {
    drawImage();
    window.addEventListener('resize', drawImage);
    return () => {
      window.removeEventListener('resize', drawImage);
    };
  }, [drawImage]);

  function bottomLayout() {
    const maxH = dataIndex !== -1 && selected && selected.text && selected.text !== undefined && selected.text.data.length > 0 ? '88vh' : '100vh';
    return (
      <Flex w={"100%"} maxH="calc(100vh - 56px)" alignContent={"center"} justifyContent={"center"} alignItems={"center"} direction={"column"}>
        <canvas ref={canvasRef} style={{ border: '0px solid black', maxHeight: maxH, maxWidth: '100%', objectFit: "contain" }} />
        <CaptionCard caption={dataIndex !== -1 && selected && selected.text !== undefined ? selected.text.data : ""}
                    minH={"10ch"}
                    maxH={"30ch"}
                    w={"full"}
                    mt={2}
                      speed={config.player.text_speed} />
      </Flex>
    )
  }

  function rightLayout() {
    const maxW = dataIndex !== -1 && selected && selected.text && selected.text !== undefined && selected.text.data.length > 0 ? '88vh' : '100vh';
    return (
      <HStack w={"100%"} maxH="calc(100vh - 56px)" alignContent={"center"} justifyContent={"center"} alignItems={"center"} direction={"column"}>
        <canvas ref={canvasRef} style={{ maxWidth: maxW, maxHeight: "calc(100vh - 56px)", objectFit: "contain" }} />
        <CaptionCard
          caption={dataIndex !== -1 && selected && selected.text !== undefined ? selected.text.data : ""}
          minW={"20ch"}
          maxW={"40ch"}
          maxH="calc(100vh - 56px)"
          speed={config.player.text_speed} />
      </HStack>
    )
  }

  return (
    <Box flexGrow={1} display="flex" alignItems="center" justifyContent="space-between" maxH="calc(100vh - 56px)" m={1}>
      {selected?.config.caption_position === 'bottom' ? bottomLayout() : rightLayout()}
    </Box>
  );
};

export default Canvas;