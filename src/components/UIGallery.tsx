import React from 'react';
import { UpdateModal } from './ui/UpdateModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { ProfileEditModal } from './profile/ProfileEditModal';
import { SplashScreen } from './SplashScreen';

export const UIGallery: React.FC = () => {
  const dummyProfile = {
    name: "AARIZ MANSURI",
    role: "RAS Aspirant",
    targetExam: "RAS CSE 2027"
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8 space-y-24">
      <h1 className="text-4xl font-bold mb-12 text-center text-blue-400">UI Components Gallery</h1>

      {/* Splash Screen */}
      <section id="splash-screen" className="relative h-[800px] border-4 border-gray-700 rounded-xl overflow-hidden bg-black">
        <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 z-50 rounded-br-lg font-bold">Splash Screen</div>
        <div className="relative w-full h-full transform scale-[0.8] origin-top">
          <SplashScreen />
        </div>
      </section>

      {/* Update Modal */}
      <section id="update-modal" className="relative h-[800px] border-4 border-gray-700 rounded-xl overflow-hidden bg-black flex items-center justify-center">
        <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 z-50 rounded-br-lg font-bold">Update Modal</div>
        <div className="relative w-full max-w-md">
          <UpdateModal 
            isOpen={true} 
            onClose={() => {}} 
            onUpdateNow={() => {}}
            updateInfo={{
              version: "v2.1.0",
              body: "### 🚀 What's New in v2.1.0\n\n- 🆕 New OCR improvements\n- 📚 New Study Material\n- ⚡ Performance improvements\n- 🛠️ Bug fixes\n- 🎨 UI improvements\n\n![Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop)",
              url: ""
            }}
            progress={null}
          />
        </div>
      </section>

      {/* Global Search Modal */}
      <section id="global-search-modal" className="relative h-[800px] border-4 border-gray-700 rounded-xl overflow-hidden bg-black/50">
        <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 z-50 rounded-br-lg font-bold">Global Search Modal</div>
        <div className="relative w-full h-full p-10">
          <GlobalSearchModal 
            isOpen={true} 
            onClose={() => {}} 
            onNavigate={(id) => {}}
          />
        </div>
      </section>

      {/* Profile Edit Modal */}
      <section id="profile-edit-modal" className="relative h-[800px] border-4 border-gray-700 rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
         <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 z-50 rounded-br-lg font-bold">Profile Edit Modal</div>
         <div className="relative w-full h-full">
            <ProfileEditModal
              isOpen={true}
              onClose={() => {}}
              userProfile={dummyProfile}
              onSave={(p) => {}}
            />
         </div>
      </section>
    </div>
  );
};
