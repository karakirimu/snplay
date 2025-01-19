export type SnCaptionPositionType = "bottom" | "right";
export type SnBlob = {
    id: string;
    name: string;
    data: string;
}

export type SnSource = {
    image: SnBlob[];
    audio: SnBlob[];
    text: SnBlob[];
}

export type SnPlayList = {
    id: string;
    image_id?: string;
    audio_id?: string;
    text_id?: string;
    config: {
      caption_position: SnCaptionPositionType;
    } 
}

export type SnPlayListParse = {
    id: string;
    image?: SnBlob;
    audio?: SnBlob;
    text?: SnBlob;
    config: {
      caption_position: SnCaptionPositionType;
    } 
}

export type SnConfig = {
    version: string;
    package_name: string;
    description: string;
    player: {
      text_speed: number;
      autoplay: boolean;
      autoplay_nextpage: boolean;
      volume: number;
    }
    src: SnSource;
    playlist: SnPlayList[];
    
    getSource(index: number): SnPlayListParse;
}

export function createSnConfig(title: string, description: string): SnConfig {
    const config: SnConfig = {
        version: '1.0.0',
        package_name: title,
        description,
        player: {
            text_speed: 100,
            autoplay: false,
            autoplay_nextpage: false,
            volume: 100
        },
        playlist: [],
        src: { image: [], audio: [], text: [] },
        getSource(index: number): SnPlayListParse {
            const playlist = this.playlist[index];
            if (playlist === undefined) {
                return { id: '', image: undefined, audio: undefined, text: undefined, config: { caption_position: 'bottom' } };
            }

            return {
                id: playlist.id,
                image: this.src.image.find((img) => img.id === playlist.image_id) || undefined,
                audio: this.src.audio.find((audio) => audio.id === playlist.audio_id) || undefined,
                text: this.src.text.find((text) => text.id === playlist.text_id) || undefined,
                config: playlist.config
            };
        }
    };
    return config;
}

export const importSnConfig = (onImport: (config: SnConfig) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const config : SnConfig = JSON.parse(reader.result as string);
                onImport(config);
            };
            reader.readAsText(file);
        }
    };
    input.click();
}