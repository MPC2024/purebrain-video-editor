"use client";
import Timeline from "./timeline";
import useStore from "./store/use-store";
import Navbar from "./navbar";
import useTimelineEvents from "./hooks/use-timeline-events";
import Scene from "./scene";
import { SceneRef } from "./scene/scene.types";
import StateManager, { DESIGN_LOAD } from "@designcombo/state";
import { useEffect, useRef, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { getCompactFontData, loadFonts } from "./utils/fonts";
import { SECONDARY_FONT, SECONDARY_FONT_URL } from "./constants/constants";
import MenuList from "./menu-list";
import { ControlItem } from "./control-item";
import CropModal from "./crop-modal/crop-modal";
import useDataState from "./store/use-data-state";
import { FONTS } from "./data/fonts";
import FloatingControl from "./control-item/floating-controls/floating-control";
import { useSceneStore } from "@/store/use-scene-store";
import { dispatch } from "@designcombo/events";
import MenuListHorizontal from "./menu-list-horizontal";
import { useIsLargeScreen } from "@/hooks/use-media-query";
import { ITrackItem } from "@designcombo/types";
import useLayoutStore from "./store/use-layout-store";
import ControlItemHorizontal from "./control-item-horizontal";
import { design } from "./mock";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import ExportModal from "./export/ExportModal";
import EffectsPanel from "./effects/EffectsPanel";
import AudioMixerPanel from "./audio/AudioMixerPanel";
import KeyframePanel from "./animation/KeyframePanel";
import TemplateBrowser from "./templates/TemplateBrowser";
import MusicBrowser from "./media/MusicBrowser";
import SoundEffects from "./media/SoundEffects";
import SmartCropPanel from "./tools/SmartCropPanel";
import BrandKitPanel from "./brand/BrandKitPanel";
import SpeedRampPanel from "./tools/SpeedRampPanel";
import StickerBrowser from "./stickers/StickerBrowser";
import WelcomeScreen from "./onboarding/WelcomeScreen";
import SettingsPanel from "./settings/SettingsPanel";
import ShortcutsPanel from "./help/ShortcutsPanel";
import ThumbnailCreator from "./thumbnail/ThumbnailCreator";

const stateManager = new StateManager({
  size: {
    width: 1080,
    height: 1920,
  },
});

const SceneContainer = ({
  sceneRef,
  playerRef,
  stateManager,
  trackItem,
  loaded,
  isLargeScreen,
}: any) => {
  const isMobile = useIsMobile(768)

  return (
    <div className={`relative flex h-full w-full flex-col bg-background shadow-inner ${isMobile ? "pb-32" : ""}`}>
      <div className={`flex-1 relative overflow-hidden w-full ${isMobile ? "h-1/2" : "h-full"}`}>
        <div className="flex h-full flex-1">
          <div className="flex-1 relative overflow-hidden w-full h-full border-r border-border/30">
            <CropModal />
            <Scene ref={sceneRef} stateManager={stateManager} />
          </div>
        </div>
      </div>

      <div className={`w-full border-t border-border/30 ${isMobile ? "h-1/2" : ""}`}>
        {playerRef && <Timeline stateManager={stateManager} />}
      </div>

      {!isLargeScreen && !trackItem && loaded && <MenuListHorizontal />}
      {!isLargeScreen && trackItem && <ControlItemHorizontal />}

      {/* Mobile Tab Bar - Only on mobile */}
      {isMobile && loaded && (
        <MobileTabBar
          mediaContent={<MenuListHorizontal />}
          musicContent={<MusicBrowser />}
          soundFxContent={<SoundEffects />}
          textContent={<div className="text-sm text-muted-foreground">Text editing features coming soon</div>}
          effectsContent={<EffectsPanel />}
          stickerContent={<StickerBrowser />}
          speedContent={<SpeedRampPanel />}
          cropContent={<SmartCropPanel />}
          audioContent={<AudioMixerPanel />}
          exportContent={<ExportModal />}
          animationContent={<KeyframePanel />}
          templateContent={<TemplateBrowser />}
          brandKitContent={<BrandKitPanel />}
          settingsContent={<SettingsPanel />}
          thumbnailContent={<ThumbnailCreator />}
        />
      )}
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="bg-card w-full flex flex-none border-r border-border/60 h-[calc(100vh-52px)] shadow-sm">
      <div className="flex flex-col w-full">
        <MenuList />
        <Separator orientation="horizontal" className="bg-border/50" />
        <ControlItem />
      </div>
    </div>
  );
};

const Editor = ({ tempId, id }: { tempId?: string; id?: string }) => {
  const [projectName, setProjectName] = useState<string>("Untitled video");
  const { scene } = useSceneStore();
  const timelinePanelRef = useRef<ImperativePanelHandle>(null);
  const sceneRef = useRef<SceneRef>(null);
  const { timeline, playerRef } = useStore();
  const { activeIds, trackItemsMap, transitionsMap } = useStore();
  const [loaded, setLoaded] = useState(false);
  const [trackItem, setTrackItem] = useState<ITrackItem | null>(null);
  const {
    setTrackItem: setLayoutTrackItem,
    setFloatingControl,
    setLabelControlItem,
    setTypeControlItem,
  } = useLayoutStore();
  const isLargeScreen = useIsLargeScreen();

  useTimelineEvents();

  const { setCompactFonts, setFonts } = useDataState();
  // useEffect(() => {
  //   dispatch(DESIGN_LOAD, { payload: design });
  // }, []);
  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, []);

  useEffect(() => {
    loadFonts([
      {
        name: SECONDARY_FONT,
        url: SECONDARY_FONT_URL,
      },
    ]);
  }, []);

  useEffect(() => {
    const screenHeight = window.innerHeight;
    const desiredHeight = 300;
    const percentage = (desiredHeight / screenHeight) * 100;
    timelinePanelRef.current?.resize(percentage);
  }, []);

  const handleTimelineResize = () => {
    const timelineContainer = document.getElementById("timeline-container");
    if (!timelineContainer) return;

    timeline?.resize(
      {
        height: timelineContainer.clientHeight - 90,
        width: timelineContainer.clientWidth - 40,
      },
      {
        force: true,
      },
    );

    // Trigger zoom recalculation when timeline is resized
    setTimeout(() => {
      sceneRef.current?.recalculateZoom();
    }, 100);
  };

  useEffect(() => {
    const onResize = () => handleTimelineResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [timeline]);

  useEffect(() => {
    if (activeIds.length === 1) {
      const [id] = activeIds;
      const trackItem = trackItemsMap[id];
      if (trackItem) {
        setTrackItem(trackItem);
        setLayoutTrackItem(trackItem);
      } else console.log(transitionsMap[id]);
    } else {
      setTrackItem(null);
      setLayoutTrackItem(null);
    }
  }, [activeIds, trackItemsMap]);

  useEffect(() => {
    setFloatingControl("");
    setLabelControlItem("");
    setTypeControlItem("");
  }, [isLargeScreen]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input field
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (isInput) return;

      // Ctrl/Cmd + S: Save project
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Auto-save is handled by the project storage hook
      }

      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        // Trigger export modal
      }

      // ?: Help/Shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        // ShortcutsPanel will handle this via Dialog
      }

      // Space: Play/Pause
      if (e.key === ' ' && !isInput) {
        e.preventDefault();
        // Timeline player handles this
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col">
      <WelcomeScreen />
      <Navbar
        projectName={projectName}
        user={null}
        stateManager={stateManager}
        setProjectName={setProjectName}
      />

      <div className="flex flex-1">
        {isLargeScreen ? (
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel
              defaultSize={30}
              minSize={20}
              maxSize={40}
              className="max-w-7xl relative bg-card min-w-0 overflow-visible!"
            >
              <Sidebar />
              <FloatingControl />
            </ResizablePanel>

            <ResizableHandle className="bg-border/90" />

            <ResizablePanel
              defaultSize={70}
              minSize={60}
              className="min-w-0 min-h-0"
            >
              <SceneContainer
                sceneRef={sceneRef}
                playerRef={playerRef}
                stateManager={stateManager}
                trackItem={trackItem}
                loaded={loaded}
                isLargeScreen={isLargeScreen}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <SceneContainer
            sceneRef={sceneRef}
            playerRef={playerRef}
            stateManager={stateManager}
            trackItem={trackItem}
            loaded={loaded}
            isLargeScreen={isLargeScreen}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
