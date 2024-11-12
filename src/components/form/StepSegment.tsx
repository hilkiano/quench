import { TFormSchema } from "@/hooks/recipe_form.hooks";
import {
  ActionIcon,
  Box,
  Card,
  Center,
  Text,
  Modal,
  Paper,
  Space,
  PaperProps,
  ScrollArea,
  useMantineTheme,
  Badge,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconEdit,
  IconGripHorizontal,
  IconGripVertical,
  IconMoodEmptyFilled,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { forwardRef, useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";
import StepForm from "./StepForm";

type TStepSegment = {
  stepsArray: UseFieldArrayReturn<TFormSchema, "steps", "step_field_id">;
};

const StepSegment = forwardRef<HTMLDivElement, PaperProps & TStepSegment>(
  ({ stepsArray, ...props }, ref) => {
    const t = useTranslations("Form");
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const [updateIndex, setUpdateIndex] = useState<number>();
    const [updateData, setUpdateData] = useState<any>();
    const [opened, { open, close }] = useDisclosure(false);

    const updateStep = (
      data: { step: string; order: number },
      index: number
    ) => {
      setUpdateIndex(index);
      setUpdateData(data);
      open();
    };

    return (
      <>
        <Box className="flex flex-col gap-4" ref={ref}>
          <div className="flex gap-4 items-center">
            <p className="m-0 text-xl xs:text-2xl font-semibold">
              {t("Recipe.title_steps")}
            </p>
            <ActionIcon
              variant="gradient"
              radius="xl"
              aria-label="Add step"
              onClick={open}
            >
              <IconPlus />
            </ActionIcon>
          </div>
          <Paper withBorder radius="md" {...props}>
            {stepsArray.fields.length > 0 ? (
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  if (destination) {
                    stepsArray.move(source.index, destination.index);
                  }
                }}
              >
                <Droppable
                  droppableId="droppable"
                  direction={isMobile ? "vertical" : "horizontal"}
                >
                  {(provided) => (
                    <ScrollArea
                      classNames={{
                        root: "h-full",
                        viewport: "h-full *:h-full",
                      }}
                    >
                      <Box
                        className="flex flex-col xs:flex-row gap-4 xs:h-[360px] h-full pb-0 xs:pb-4 overflow-hidden"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {stepsArray.fields.map((s, i) => (
                          <Draggable
                            key={i}
                            index={i}
                            draggableId={`item-[${i}]`}
                          >
                            {(provided, snapshot) => (
                              <Card
                                className={`xs:min-w-[200px] xs:w-[200px] rounded-lg ${
                                  snapshot.isDragging
                                    ? "drop-shadow-2xl"
                                    : "drop-shadow-md"
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                <Badge
                                  variant="gradient"
                                  size="lg"
                                  className={`absolute top-2 ${
                                    isMobile ? "left-11" : "left-2"
                                  }`}
                                >
                                  {t("Recipe.step", { order: i + 1 })}
                                </Badge>
                                <div className="flex gap-2 items-center absolute top-2 right-2">
                                  <ActionIcon
                                    variant="transparent"
                                    radius="xl"
                                    size="sm"
                                    onClick={() => updateStep(s, i)}
                                  >
                                    <IconEdit />
                                  </ActionIcon>
                                  <ActionIcon
                                    variant="transparent"
                                    radius="xl"
                                    color="red"
                                    size="sm"
                                    onClick={() => stepsArray.remove(i)}
                                  >
                                    <IconTrash />
                                  </ActionIcon>
                                </div>
                                <Space h="lg"></Space>
                                <Text
                                  lineClamp={isMobile ? 3 : 8}
                                  className="text-lg mt-2 ml-8 xs:ml-0"
                                >
                                  {s.step}
                                </Text>
                                {isMobile ? (
                                  <div
                                    className="absolute left-2 bottom-1/2 translate-y-1/2 transform"
                                    {...provided.dragHandleProps}
                                  >
                                    <IconGripVertical />
                                  </div>
                                ) : (
                                  <div
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 transform"
                                    {...provided.dragHandleProps}
                                  >
                                    <IconGripHorizontal />
                                  </div>
                                )}
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    </ScrollArea>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <Center className="flex flex-col gap-2 opacity-45 justify-center h-full">
                <IconMoodEmptyFilled size={44} />
                {t("Recipe.no_data", {
                  data: t("Recipe.title_steps").toLowerCase(),
                })}
              </Center>
            )}
          </Paper>
        </Box>

        <Modal
          opened={opened}
          onClose={close}
          title={
            typeof updateIndex !== "undefined"
              ? t("Recipe.modal_title_update_step")
              : t("Recipe.modal_title_step")
          }
        >
          <StepForm
            className="flex flex-col gap-4"
            submitFn={(data) => {
              if (typeof updateIndex !== "undefined") {
                stepsArray.update(updateIndex, {
                  ...updateData,
                  step: data.step,
                });
              } else {
                stepsArray.append({
                  ...data,
                  order: stepsArray.fields.length + 1,
                });
              }
              close();
              setUpdateData(undefined);
              setUpdateIndex(undefined);
            }}
            data={updateData}
          />
        </Modal>
      </>
    );
  }
);

StepSegment.displayName = "StepSegment";
export default StepSegment;
