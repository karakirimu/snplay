import React, { useEffect } from 'react';
import { Box, HStack, IconButton, Button, Input } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';
import { importSnConfig, SnConfig } from '@/types/SnConfig';
import { Property } from '@/functions/useProperty';
import { SourceMap } from '@/types/SourceMap';
import AudioPlayer from './AudioPlayer';
import { ColorModeButton } from './ui/color-mode';

interface HeaderProps {
  onImport: (config: SnConfig) => void;
  onIndexChange: (index: number) => void;
  config: Property<SnConfig>;
  audioSrc: SourceMap[];
  index: number;
  lastImageIndex: number | null;
}

const Header: React.FC<HeaderProps> = ({ onImport, onIndexChange, config, audioSrc, index, lastImageIndex }) => {
  const dataIndex = index - 1;
  const selected = dataIndex !== -1 && config ? config.get().getSource(dataIndex) : undefined;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (0 < index) {
        switch (event.key) {
          case 'ArrowLeft':
            onIndexChange(index - 1);
            break;
          case 'ArrowRight':
            onIndexChange(index + 1);
            break;
          case 'Home':
            onIndexChange(1);
            break;
          case 'End':
            if (lastImageIndex !== null) {
              onIndexChange(lastImageIndex);
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, lastImageIndex, onIndexChange]);

  return (
    <Box as="header" bg={{ base: "gray.200", _dark: "gray.700" }} borderBottom={"1px solid gray.950"} color="white" p={1}>
      <HStack justify="space-between" px={1}>
        <HStack gap={2} w={"15vw"}>
          <MenuRoot size={"sm"}>
            <MenuTrigger asChild>
              <Button variant="ghost" size="sm">
                File
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="import-a" onClick={() => importSnConfig(onImport)}>
                Open Playlist
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </HStack>
        {(index !== 0) && (
          <HStack gap={0}>
            <IconButton onClick={() => onIndexChange(1)} variant="outline" size="sm" title='First image (Home)'>
              <BiFirstPage />
            </IconButton>
            <IconButton onClick={() => onIndexChange(index - 1)} variant="outline" size="sm" title='Previous image (←)'>
              <GoArrowLeft />
            </IconButton>
            <Input color={{ base: "black", _dark: "white" }} id='image-index' size="sm" w="6ch" textAlign="center" value={index} readOnly />
            <IconButton onClick={() => onIndexChange(index + 1)} variant="outline" size="sm" title='Next image (→)'>
              <GoArrowRight />
            </IconButton>
            <IconButton onClick={() => lastImageIndex && onIndexChange(lastImageIndex)} variant="outline" size="sm" title='Last image (End)'>
              <BiLastPage />
            </IconButton>
          </HStack>
        )}
        <HStack gap={4}>
          {(selected !== undefined && selected.audio) ? 
            <Box w={"15vw"} ml={4}>
              <AudioPlayer fileUrl={audioSrc.find((f) => f.id === selected.audio?.id)!.src.objectURL}
                           autoPlay={config.get().player.autoplay}
                           volume={config.get().player.volume}
                           onEnd={() => {
                            if (config.get().player.autoplay_nextpage) {
                              setTimeout(() => {
                                onIndexChange(index + 1)
                              }, 3000);
                            }
                          }}/>
            </Box>: <></>}
            <ColorModeButton/>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;