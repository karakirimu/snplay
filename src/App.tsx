import { Button, Card, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { createSnConfig, SnConfig } from './types/SnConfig';
import { useProperty } from './functions/useProperty';
import { decodeBase64 } from "./functions/base64";
import { SourceMap } from "./types/SourceMap";
import Canvas from "./components/Canvas";
import { Field } from "./components/ui/field";
import { Slider } from "./components/ui/slider";
import { Switch } from "./components/ui/switch";
import { InfoTip } from "./components/ui/toggle-tip";

function App() {
  const images = useProperty<SourceMap[]>([]);
  const musics = useProperty<SourceMap[]>([]);
  const selectedIndex = useProperty<number>(0);
  const imageLastIndex = useProperty<number | null>(null);
  const snConfig = useProperty<SnConfig>(createSnConfig("No Title", "No Description"));
 
  const handleIndexClick = (index: number) => {
    if(index < 1 || index > images.get().length) {
      return;
    }
    selectedIndex.set(index);
  };

  const importConfig = async (configData: SnConfig) => {
    const imageUrls = await Promise.all(configData.src.image.map(async (item) => {
      const blob = decodeBase64(item.data);
      const objectURL = URL.createObjectURL(blob);
      return {
        id: item.id,
        src: {
          name: item.name,
          size: blob.size,
          type: blob.type,
          path: '', // You can set the path if needed
          objectURL
        }
    };
    }));

    const audioUrls = await Promise.all(configData.src.audio.map(async (item) => {
      if(item === undefined) {
        return { id: "", src: {
          name: "Unknown",
          size: 0,
          type: "",
          path: '', // You can set the path if needed
          objectURL: ""
        }};
      }
      const blob = decodeBase64(item.data);
      const objectURL = URL.createObjectURL(blob);
      return {
        id: item.id,
        src:{
            name: item.name,
            size: blob.size,
            type: blob.type,
            path: '', // You can set the path if needed
            objectURL
          }
        };
    }))
  
    snConfig.set((prev) => ({...prev, ...configData}));
  
    if (imageUrls.length > 0) {
      imageLastIndex.set(imageUrls.length);
      images.set(imageUrls);
      musics.set(audioUrls);
    }
  };

  const onHomeClick = () => {
    selectedIndex.set(0);
  }

  return (
    <>
      <Header onImport={importConfig}
              onIndexChange={handleIndexClick}
              config={snConfig}
              audioSrc={musics.get()}
              index={selectedIndex.get()}
              lastImageIndex={imageLastIndex.get()}/>
      <HStack align="start" p={0} m={0} gap={0}>
      <Sidebar images={images}
               selectedIndex={selectedIndex}
               config={snConfig}
               onClick={handleIndexClick}
               onImport={importConfig}
               onHomeClick={onHomeClick}
               />
      {selectedIndex.get() !== 0 ? <Canvas imageSrc={images.get()} index={selectedIndex.get()} config={snConfig.get()} />
        : (<Flex justifyContent="center" alignItems="center"  w={"100%"} h={"60vh"}>
        <Card.Root w="lg">
          <Card.Header>
            <Card.Title>{snConfig.get().package_name}</Card.Title>
            <Card.Description>
              {snConfig.get().description}
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Stack gap="4" w="full">
            <Text fontSize={"lg"} >Settings</Text>
            <Field label={`Text speed: ${snConfig.get().player.text_speed} (ms)`}>
              <HStack w={"full"}>
                <Slider
                  w={"full"}
                  mr={2}
                  step={10}
                  min={0}
                  value={[snConfig.get().player.text_speed]}
                  max={10000}
                  onValueChange={(e) => { snConfig.set({ ...snConfig.get(), player: { ...snConfig.get().player, text_speed: e.value[0] }})}}/>
                <InfoTip content="Time interval to display one character (in milliseconds)" />
              </HStack>
            </Field>
            <Field label={`Volume: ${snConfig.get().player.volume}`}>
              <HStack w={"full"}>
                <Slider
                  mr={2}
                  w={"full"}
                  step={1}
                  min={0}
                  value={[snConfig.get().player.volume]}
                  max={100}
                  onValueChange={(e) => { snConfig.set({ ...snConfig.get(), player: { ...snConfig.get().player, volume: e.value[0] }})}}/>
                <InfoTip content="Default Volume of the player" />
              </HStack>
            </Field>
            <Field label="Autoplay">
              <Switch checked={snConfig.get().player.autoplay} 
                      onCheckedChange={(e) => { snConfig.set({ ...snConfig.get(), player: { ...snConfig.get().player, autoplay: e.checked }})}}
                      mt={2}>
              </Switch>
            </Field>
          </Stack>
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Button variant="outline" onClick={() => handleIndexClick(1)}>Start</Button>
          </Card.Footer>
        </Card.Root>
        </Flex>)}
      </HStack>
    </>
  );
}

export default App;