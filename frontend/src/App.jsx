import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route
              path="/new"
              element={<ProtectedRoute><PostForm mode="create" /></ProtectedRoute>}
            />
            <Route
              path="/posts/:slug/edit"
              element={<ProtectedRoute><PostForm mode="edit" /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="border-t border-hairline bg-panel py-16 mt-auto">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-ink mb-3">
                Foolscap
              </h3>
              <p className="text-xs leading-relaxed text-ink-soft">
                An independent home for fine writing, essays, and stories. Fully rendered in digital ink on virtual paper.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono font-semibold text-ink mb-4">
                Explore
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/" className="text-ink-soft hover:text-teal transition-colors">
                    Read Feed
                  </a>
                </li>
                <li>
                  <a href="/?search=" className="text-ink-soft hover:text-teal transition-colors">
                    Search Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ink-soft hover:text-teal transition-colors">
                    Writing Guides
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono font-semibold text-ink mb-4">
                Write
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="/new" className="text-ink-soft hover:text-teal transition-colors">
                    New Draft
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-ink-soft hover:text-teal transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="text-ink-soft hover:text-teal transition-colors">
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider font-mono font-semibold text-ink mb-4">
                Platform
              </h4>
              <p className="text-xs leading-relaxed text-ink-soft mb-2">
                Built with React & Vite. Styling powered by Tailwind CSS v4. Data stored securely in MongoDB Atlas.
              </p>
              <div className="text-[10px] font-mono text-ink-soft bg-paper/60 px-2 py-1 rounded inline-block">
                v1.2.0 · Stable
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-hairline/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs font-mono text-ink-soft">
            <div>
              © {new Date().getFullYear()} Foolscap. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5">
              <span>Made with love for the written word</span>
              <span className="text-rust">❤</span>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
