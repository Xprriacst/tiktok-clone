import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import Breadcrumb from "components/ui/Breadcrumb";

// Page imports - ne garder que les pages fonctionnelles
import DashboardHome from "pages/dashboard-home";
import VideoCreationWorkflow from "pages/video-creation-workflow";
import AvatarVoiceCustomization from "pages/avatar-voice-customization";
import VideoPreviewExport from "pages/video-preview-export";

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
              <Route path="/dashboard-home" element={<Navigate to="/" replace />} />
              <Route path="/video-creation-workflow" element={<VideoCreationWorkflow />} />
              <Route path="/avatar-voice-customization" element={<AvatarVoiceCustomization />} />
              <Route path="/video-preview-export" element={<VideoPreviewExport />} />
              {/* Rediriger les routes non fonctionnelles vers la page d'accueil */}
              <Route path="/processing-status-queue" element={<Navigate to="/" replace />} />
              <Route path="/project-history-library" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </RouterRoutes>
          </main>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;