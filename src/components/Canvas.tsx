import { Box } from '@chakra-ui/react';
import React, { useRef, useEffect, useCallback } from 'react';

interface CanvasProps {
  imageSrc: string;
}

const Canvas: React.FC<CanvasProps> = ({ imageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context && imageSrc) {
      const image = new Image();
      image.src = imageSrc;
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
  }, [imageSrc]);

  useEffect(() => {
    drawImage();
    window.addEventListener('resize', drawImage);
    return () => {
      window.removeEventListener('resize', drawImage);
    };
  }, [drawImage]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" w={"calc(100% - 200px)"} height="calc(100vh - 40px)" p={0}>
      <canvas ref={canvasRef} style={{ border: '0px solid black' }} />
    </Box>
  );
};

export default Canvas;