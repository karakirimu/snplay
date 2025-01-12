import { SnConfig } from '@/types/SnConfig';
import { SourceMap } from '@/types/SourceMap';
import { Flex } from '@chakra-ui/react';
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
  // const captionCardRef = useRef<CaptionCardHandle>(null);

  // const handleReplay = () => {
  //     captionCardRef.current?.replay();
  // };
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

  return (
    <Flex w={"100%"} maxH={"100%"} alignContent={"center"} justifyContent={"center"} alignItems={"center"} direction={"column"}>
        <canvas ref={canvasRef} style={{ border: '0px solid black', maxWidth: '100%', objectFit: "contain" }} />
        <CaptionCard 
                      // ref={captionCardRef}
                      caption={dataIndex !== -1 && selected && selected.text !== undefined ? selected.text.data : ""}
                      w={"full"}
                      mt={2}
                      speed={config.player.text_speed} />
    </Flex>
  );
};

export default Canvas;