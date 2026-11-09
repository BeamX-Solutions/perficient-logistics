import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { TermsPage } from './pages/TermsPage';

// Staff only, so it stays out of the public bundle.
const AdminEventsPage = lazy(() => import('./pages/AdminEventsPage'));

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/admin/events"
          element={
            <Suspense fallback={<div className="min-h-screen bg-ink" />}>
              <AdminEventsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
