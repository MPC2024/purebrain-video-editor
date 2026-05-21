import { IDesign } from "@designcombo/types";
import { create } from "zustand";
interface Output {
  url: string;
  type: string;
}

interface DownloadState {
  projectId: string;
  exporting: boolean;
  exportType: "json" | "mp4";
  progress: number;
  output?: Output;
  payload?: IDesign;
  displayProgressModal: boolean;
  captionText?: string;
  captionStyle?: string;
  brandKit?: string;
  actions: {
    setProjectId: (projectId: string) => void;
    setExporting: (exporting: boolean) => void;
    setExportType: (exportType: "json" | "mp4") => void;
    setProgress: (progress: number) => void;
    setState: (state: Partial<DownloadState>) => void;
    setOutput: (output: Output) => void;
    startExport: () => void;
    setDisplayProgressModal: (displayProgressModal: boolean) => void;
  };
}

//const baseUrl = "https://api.combo.sh/v1";

export const useDownloadState = create<DownloadState>((set, get) => ({
  projectId: "",
  exporting: false,
  exportType: "mp4",
  progress: 0,
  displayProgressModal: false,
  captionText: "",
  captionStyle: "classic",
  brandKit: "none",
  actions: {
    setProjectId: (projectId) => set({ projectId }),
    setExporting: (exporting) => set({ exporting }),
    setExportType: (exportType) => set({ exportType }),
    setProgress: (progress) => set({ progress }),
    setState: (state) => set({ ...state }),
    setOutput: (output) => set({ output }),
    setDisplayProgressModal: (displayProgressModal) =>
      set({ displayProgressModal }),
    startExport: async () => {
      try {
        // Set exporting to true at the start
        set({ exporting: true, displayProgressModal: true });

        // Assume payload to be stored in the state for POST request
        const { payload, exportType, captionText, captionStyle, brandKit } =
          get();

        if (!payload) throw new Error("Payload is not defined");

        // Step 1: POST request to start local rendering
        const response = await fetch(`/api/export`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            design: payload,
            captionText: captionText || "",
            captionStyle: captionStyle || "classic",
            brandKit: brandKit || "none",
            format: exportType,
            quality: "medium",
            width: payload.size?.width || 1920,
            height: payload.size?.height || 1080,
            fps: 30
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to submit export request."
          );
        }

        const jobInfo = await response.json();
        const jobId = jobInfo.jobId;

        // Step 2 & 3: Polling for status updates
        const checkStatus = async () => {
          try {
            const statusResponse = await fetch(
              `/api/export?jobId=${jobId}`,
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            );

            if (!statusResponse.ok)
              throw new Error("Failed to fetch export status.");

            const statusInfo = await statusResponse.json();
            const { status, progress, downloadUrl } = statusInfo;

            set({ progress: Math.round(progress) });

            if (status === "complete") {
              set({
                exporting: false,
                output: {
                  url: downloadUrl || `/api/export/download/${jobId}`,
                  type: exportType
                }
              });
            } else if (
              status === "processing" ||
              status === "pending"
            ) {
              setTimeout(checkStatus, 2500);
            } else if (status === "error") {
              throw new Error(
                statusInfo.errorMessage || "Export processing failed"
              );
            }
          } catch (statusError) {
            console.error("Status check error:", statusError);
            setTimeout(checkStatus, 2500);
          }
        };

        checkStatus();
      } catch (error) {
        console.error(error);
        set({ exporting: false });
      }
    }
  }
}));
