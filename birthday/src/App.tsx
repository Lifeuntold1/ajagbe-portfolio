import React, { useState, useEffect } from 'react';
import { BookReader } from './components/BookReader';
import { MarkdownParser } from './utils/markdownParser';
import { BookData } from './types/book';
import manuscriptContent from '../birthday.md?raw';
import { LockScreen } from './components/LockScreen';
import { GlobalBackground } from './components/GlobalBackground';

function App() {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const parseBook = async () => {
      try {
        const parsedBook = MarkdownParser.parseMarkdown(manuscriptContent);
        setBookData(parsedBook);
      } catch (error) {
        console.error('Error parsing manuscript:', error);
      } finally {
        setLoading(false);
      }
    };

    parseBook();
  }, []);

  return (
    <GlobalBackground>
      {!isUnlocked ? (
        <LockScreen onUnlock={() => setIsUnlocked(true)} />
      ) : loading ? (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-100 mx-auto mb-4"></div>
            <p className="text-slate-100 font-medium">Loading your chapter...</p>
          </div>
        </div>
      ) : !bookData ? (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
            <p className="text-red-400 font-medium">Error loading book content</p>
          </div>
        </div>
      ) : (
        <BookReader bookData={bookData} />
      )}
    </GlobalBackground>
  );
}

export default App;