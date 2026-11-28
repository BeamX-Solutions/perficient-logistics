import { Navigate, Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { PaymentCompletePage } from './pages/PaymentCompletePage';
import { PaymentPage } from './pages/PaymentPage';
import { TermsPage } from './pages/TermsPage';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/pay/:reference" element={<PaymentPage />} />
        <Route path="/payment/complete" element={<PaymentCompletePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
