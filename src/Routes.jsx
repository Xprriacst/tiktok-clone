import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import Breadcrumb from "components/ui/Breadcrumb";

// Page imports
import DashboardHome from "pages/dashboard-home";
import VideoCreationWorkflow from "pages/video-creation-workflow";
import AvatarVoiceCustomization from "pages/avatar-voice-customization";
import ProcessingStatusQueue from "pages/processing-status-queue";
import VideoPreviewExport from "pages/video-preview-export";
import ProjectHistoryLibrary from "pages/project-history-library";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <div className="min-h-screen bg-background">
          <Header />
          <Breadcrumb />
          <main className="pt-16 pb-20 md:pb-4">
            <RouterRoutes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/dashboard-home" element={<DashboardHome />} />
              <Route path="/video-creation-workflow" element={<VideoCreationWorkflow />} />
              <Route path="/avatar-voice-customization" element={<AvatarVoiceCustomization />} />
              <Route path="/processing-status-queue" element={<ProcessingStatusQueue />} />
              <Route path="/video-preview-export" element={<VideoPreviewExport />} />
              <Route path="/project-history-library" element={<ProjectHistoryLibrary />} />
            </RouterRoutes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;