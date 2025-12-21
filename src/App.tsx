import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TarotProvider } from './context/TarotContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { InputPage } from './pages/InputPage';
import { SpreadSelectionPage } from './pages/SpreadSelectionPage';
import { ResultPage } from './pages/ResultPage';

function App() {
  return (
    <TarotProvider>
      <BrowserRouter>
        <div className="app-container">
          <header className="main-header">
            <h1>✦ タロット × 16シジル ✦</h1>
            <p className="subtitle">内なる導きを求めて</p>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/onboarding" replace />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/input" element={<InputPage />} />
              <Route path="/select-spread" element={<SpreadSelectionPage />} />
              <Route path="/result" element={<ResultPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TarotProvider>
  );
}

export default App;
