import React, { useState, useEffect } from 'react';
import { Button, ImageList, ImageListItem, Stack, Typography, Paper, ImageListItemBar } from "@mui/material";
import { IContentPickerSettings, showContentPicker } from "@picturepark/sdk-v1-pickers";
import ReactDOM from "react-dom";

const contentPickerSettings: IContentPickerSettings = {
    debug: false,
    width: 1100,
    height: 600,
    embedName: "Caller defined embed name",
    returnType: "embed",
    enableCollections: true,
    enableMediaEditor: true,
    mediaEditorUnlockPreset: false,
};
import {ContextProps} from "./types";

const OptionsContext = React.createContext<any>(null);

export default function createExternalRoot(container: HTMLElement) {
    function PictureParkViewer({ context }: { context: ContextProps }) {
        const [selectedFiles, setSelectedFiles] = useState<Array<{ viewUrl: string; fileName: string }>>([]);
        const [draggedImg, setDraggedImg] = useState<number | null>(null);

        useEffect(() => {
            const associatedImages = context.entity?.properties.AssociatedImages;
            if (associatedImages) {
                try {
                    const images = JSON.parse(associatedImages.Invariant);
                    if (Array.isArray(images)) {
                        setSelectedFiles(images.map(img => ({
                            viewUrl: img.viewUrl || '',
                            fileName: img.fileName || 'Unnamed image'
                        })));
                    }
                } catch {
                    console.error("Failed to parse AssociatedImages JSON.");
                }
            }
        }, [context.entity]);

        const openContentPicker = async () => {
            const result = await showContentPicker(`${context.config.pictureParkUrl}/contentPicker`, contentPickerSettings);
            const files = (result.embed?.contentSelections || []).map((selection: any) => ({
                viewUrl: selection.outputs[0].viewUrl,
                fileName: selection.outputs[0].detail.originalFileName || 'Unnamed image',
            }));
            setSelectedFiles(files);
            updateEntity(files);
        };

        const updateEntity = async (files: Array<{ viewUrl: string; fileName: string }>): Promise<void> => {
            try {
              const id = context.entity.systemProperties.id;
              const jobEntity = await context.client.entities.getAsync(id);
              const filesJson = JSON.stringify(files);
              jobEntity?.setPropertyValue(context.config.FieldName, filesJson);
              if (jobEntity) {
                await context.client.entities.saveAsync(jobEntity);
              }
            } catch (error) {
              console.error(`Error updating entity for AssociatedImages:`, error);
            }
            // Update entity logic here, similar to previous updateEntity logic.
        };

        const handleDragStart = (index: number) => () => {
            setDraggedImg(index);
        };

        const handleDragOver = (event: React.DragEvent) => {
            event.preventDefault(); // Necessary for the onDrop event to fire.
        };

        const handleDrop = (index: number) => (event: React.DragEvent) => {
            event.preventDefault();
            if (draggedImg !== null) {
                const newFiles = Array.from(selectedFiles);
                const [removed] = newFiles.splice(draggedImg, 1);
                newFiles.splice(index, 0, removed);
                setSelectedFiles(newFiles);
                updateEntity(newFiles);
            }
        };

        return (
            <Paper>
                <Stack sx={{ p: 3 }}>
                    <Typography variant="h4" fontSize={24}>
                        <Button onClick={openContentPicker}>Select Content</Button>
                    </Typography>
                    <ImageList cols={3} gap={8}>
                        {selectedFiles.map((item, index) => (
                            <ImageListItem
                                key={item.viewUrl}
                                draggable
                                onDragStart={handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop(index)}
                                sx={{ cursor: 'grab' }}
                                style={{ width: '150px'}}
                            >
                                <img
                                    src={item.viewUrl}
                                    alt={item.fileName}
                                    loading="lazy"
                                    style={{ height: '100%' }}
                                />
                                <ImageListItemBar
                                    title={item.fileName}
                                    position="below"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Stack>
            </Paper>
        );
    }

    return {
        render(context: ContextProps) {
            ReactDOM.render(
                <OptionsContext.Provider value={context.options}>
                    <PictureParkViewer context={context} />
                </OptionsContext.Provider>,
                container
            );
        },
        unmount() {
            ReactDOM.unmountComponentAtNode(container);
        },
    };
}
