import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import {
  AboutPage,
  AdminPage,
  ApplyPage,
  BenefitsPage,
  CareersPage,
  ContactPage,
  HomePage,
  JobDetailsPage,
  NotFoundPage,
  SuccessPage,
} from './features';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/apply/:id" element={<ApplyPage />} />
        <Route path="/success/:id" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/benefits" element={<BenefitsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
