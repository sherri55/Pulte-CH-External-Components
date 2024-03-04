import {
  Button,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { OutputDataBase } from "@picturepark/sdk-v1-fetch";
import {
  IContentPickerSettings,
  showContentPicker,
} from "@picturepark/sdk-v1-pickers";
import { useState } from "react";

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

const PictureParkViewer = (props: { pictureParkUrl: string }) => {
  const [selectedFiles, setSelectedFiles] = useState<
    Array<{ viewUrl: string; detail: OutputDataBase }>
  >([]);

  const openContentPicker = async () => {
    const result = await showContentPicker(
      `${props.pictureParkUrl}/contentPicker`,
      contentPickerSettings
    );
    console.log(result);
    const files: Array<{ viewUrl: string; detail: OutputDataBase }> = (
      result.embed?.contentSelections || []
    ).map((selection: any) => ({
      viewUrl: selection.outputs[0].viewUrl,
      detail: selection.outputs[0].detail,
    }));
    files && setSelectedFiles(files || []);
  };

  return (
    <Paper>
      <Stack sx={{ p: 3 }}>
        <Typography variant="h4" fontSize={24}>
          <Button onClick={openContentPicker}>Select Content</Button>
        </Typography>
        <ImageList cols={3} gap={8}>
          {selectedFiles.map((item) => (
            <ImageListItem key={item.viewUrl}>
              <img
                src={item.viewUrl}
                alt={item.detail.originalFileName}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
        {selectedFiles.map((item) => (
            <label className="image-src" image-src={item.viewUrl}>Url: {item.viewUrl}</label>
          ))}
      </Stack>
    </Paper>
  );
};

export default PictureParkViewer;
