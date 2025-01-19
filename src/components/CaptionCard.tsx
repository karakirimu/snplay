import { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Box, BoxProps, Text } from "@chakra-ui/react";
import { useProperty } from "@/functions/useProperty";

type CaptionCardProps = {
    caption?: string;
    speed: number;
} & BoxProps;

export interface CaptionCardHandle {
    replay: () => void;
}

const CaptionCard: React.ForwardRefRenderFunction<CaptionCardHandle, CaptionCardProps> = (props, ref) => {
    const temp = useProperty<string>("");
    const intervalRef = useRef<number | null>(null);
    const captionRef = useRef<HTMLDivElement>(null);

    const startInterval = () => {
        const interval_time = props.speed;

        if (props.caption && props.caption.length > 0) {
            let index = 0;
            let text = "";
            temp.set("");

            intervalRef.current = window.setInterval(() => {
                temp.set(text += props.caption![index]);
                index++;

                if (index === props.caption!.length) {
                    clearInterval(intervalRef.current!);
                }
            }, interval_time);
        }
    };

    useEffect(() => {
        if(props.speed > 0){
            startInterval();
            return () => clearInterval(intervalRef.current!);
        } else {
            clearInterval(intervalRef.current!);
            temp.set(props.caption!);
        }
    }, [props.caption, props.speed]);

    useImperativeHandle(ref, () => ({
        replay: () => {
            clearInterval(intervalRef.current!);
            startInterval();
        }
    }));

    useEffect(() => {
        const el = captionRef.current;
        if (el && el.clientHeight < el.scrollHeight) {
          el.scrollTop = el.scrollHeight - el.clientHeight;
        }
      });

    return (
        (props.caption) ? (
            <Box
                ref={captionRef}
                scrollBehavior={"smooth"}
                as="section"
                bg={{ base: "gray.100", _dark: "gray.800" }}
                borderLeft={"1px solid gray.950"}
                p={2}
                m={0}
                borderRadius={4}
                overflowY="auto"
                {...props}>
                <Text whiteSpace={"pre-wrap"}>{temp.get()}</Text>
            </Box>
        ) : <></>
    );
};

export default forwardRef(CaptionCard);