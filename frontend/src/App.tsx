import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Publications from './pages/Publications';
import PublicationPage from './pages/PublicationPage';
import ExperiencePage from './pages/ExperiencePage';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import ProfileEditor from './pages/admin/ProfileEditor';
import { ExperienceAdmin, MediaAdmin, PublicationsAdmin, SkillsAdmin } from './pages/admin/sections';
import AccountAdmin from './pages/admin/AccountAdmin';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="publications" element={<Publications />} />
        <Route path="publications/:id" element={<PublicationPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/login" element={<Login />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="publications" element={<PublicationsAdmin />} />
        <Route path="experience" element={<ExperienceAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="media" element={<MediaAdmin />} />
        <Route path="account" element={<AccountAdmin />} />
      </Route>
    </Routes>
  );
}
