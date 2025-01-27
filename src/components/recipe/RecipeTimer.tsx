"use client";

import { cn } from "@/utils";
import { ActionIcon, Box, BoxProps, Text, Button } from "@mantine/core";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRotateClockwise,
  IconX,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef, useState } from "react";
import { useTimer } from "react-timer-hook";
import { Howl } from "howler";

type TRecipeTimer = {
  timer: number;
};

const sound = new Howl({
  src: ["/audios/timer.wav"],
  loop: true,
});

const RecipeTimer = forwardRef<HTMLDivElement, BoxProps & TRecipeTimer>(
  (props, ref) => {
    const t = useTranslations("Recipe");

    const { className, timer, ...boxProps } = props;
    const [isPlaying, setIsPlaying] = useState(false);

    const {
      totalSeconds,
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({
      autoStart: false,
      expiryTimestamp: new Date(Date.now() + timer * 1000),
      onExpire: () => {
        sound.play();
        setIsPlaying(true);
      },
    });

    return (
      <Box {...boxProps} ref={ref} className={className}>
        <div
          className={cn(
            "flex gap-1 items-center p-1 px-2 rounded-full border border-solid dark:border-neutral-700 border-neutral-300 transition-colors",
            {
              "bg-[var(--mantine-primary-color-2)] dark:bg-[var(--mantine-primary-color-9)]":
                isRunning,
            }
          )}
        >
          {!isRunning ? (
            <ActionIcon
              disabled={totalSeconds === 0}
              size="sm"
              variant="default"
              radius="xl"
              onClick={start}
            >
              <IconPlayerPlayFilled size={12} />
            </ActionIcon>
          ) : (
            <ActionIcon
              disabled={totalSeconds === 0}
              size="sm"
              variant="default"
              radius="xl"
              onClick={pause}
            >
              <IconPlayerPauseFilled size={12} />
            </ActionIcon>
          )}
          <Text className="text-md font-zzz">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </Text>
          <ActionIcon
            size="sm"
            variant="default"
            radius="xl"
            className="ms-2"
            onClick={() => {
              restart(new Date(Date.now() + timer * 1000), false);
              sound.stop();
              setIsPlaying(false);
            }}
          >
            <IconRotateClockwise size={12} />
          </ActionIcon>
        </div>
        {isPlaying && (
          <Button
            size="xs"
            variant="outline"
            color="red"
            radius="xl"
            leftSection={<IconX size={14} />}
            onClick={() => {
              sound.stop();
              setIsPlaying(false);
            }}
          >
            {t("btn_dismiss")}
          </Button>
        )}
      </Box>
    );
  }
);

RecipeTimer.displayName = "RecipeTimer";
export default RecipeTimer;
