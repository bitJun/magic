import PrototypePage from './components/PrototypePage.jsx';
import { getPageByPath, pages } from './generated/pages.js';
import { useAppStore } from './stores/useAppStore.js';
import { useEffect } from 'react';

export default function App() {
  const path = window.location.pathname;
  const page = getPageByPath(path) ?? pages[0];
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  return <PrototypePage page={page} />;
}
