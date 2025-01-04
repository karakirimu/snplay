import React, { useEffect } from 'react';
import { Box, HStack, IconButton, Button, Input } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
import { handleOpenFolder } from '@/functions/FileHandler';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { BiFirstPage, BiLastPage } from 'react-icons/bi';

interface HeaderProps {
  onFolderSelect: (files: FileList) => void;
  onIndexChange: (index: number) => void;
  selectedIndex: number | null;
  lastImageIndex: number | null;
}

const Header: React.FC<HeaderProps> = ({ onFolderSelect, onIndexChange, selectedIndex, lastImageIndex }) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex !== null) {
        switch (event.key) {
          case 'ArrowLeft':
            onIndexChange(selectedIndex - 1);
            break;
          case 'ArrowRight':
            onIndexChange(selectedIndex + 1);
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
  }, [selectedIndex, lastImageIndex, onIndexChange]);

  return (
    <Box as="header" bg={"gray.700"} borderBottom={"1px solid gray.950"} color="white" p={0}>
      <HStack justify="space-between" px={2}>
        <HStack gap={4}>
          <MenuRoot size={"sm"}>
            <MenuTrigger asChild>
              <Button variant="outline" size="sm">
                File
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="open-folder-a" onClick={() => handleOpenFolder({ onFolderSelect })}>
                Open Folder...
                {/* Open Folder... <MenuItemCommand>Ctrl+O</MenuItemCommand> */}
              </MenuItem>
              {/* <MenuItem value="import-a">
                Import Playlist <MenuItemCommand>Ctrl+I</MenuItemCommand>
              </MenuItem> */}
            </MenuContent>
          </MenuRoot>
        </HStack>
        {(selectedIndex !== null) && (
          <HStack gap={0}>
            <IconButton onClick={() => onIndexChange(1)} variant="outline" size="sm">
              <BiFirstPage />
            </IconButton>
            <IconButton onClick={() => onIndexChange(selectedIndex - 1)} variant="outline" size="sm">
              <GoArrowLeft />
            </IconButton>
            <Input size="sm" w="40px" textAlign="center" value={selectedIndex} readOnly />
            <IconButton onClick={() => onIndexChange(selectedIndex + 1)} variant="outline" size="sm">
              <GoArrowRight />
            </IconButton>
            <IconButton onClick={() => lastImageIndex && onIndexChange(lastImageIndex)} variant="outline" size="sm">
              <BiLastPage />
            </IconButton>
          </HStack>
        )}
        <HStack gap={4}>
          {/* <IconButton
            aria-label="Settings"
            variant="ghost"
            color="white"
          >
            <FaCog />
          </IconButton> */}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Header;