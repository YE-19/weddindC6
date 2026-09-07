import React, { useState, useRef } from 'react';
import { invitationConfig } from './data/invitationData';

import EnvelopeCover from './components/EnvelopeCover';
import Announcement from './components/Announcement';
import PhotoGallery from './components/PhotoGallery';
import CountdownCalendar from './components/CountdownCalendar';
import VenueLocation from './components/VenueLocation';
import Guestbook from './components/Guestbook';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';

export default function App() {
  // Envelope open state
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const currentCouple = invitationConfig.couple;
  const currentDate = invitationConfig.eventDate;
  const currentVenue = invitationConfig.venue;

  const handleStartAudio = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    handleStartAudio();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReopenEnvelope = () => {
    setIsOpened(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#55473C] relative selection:bg-[#6D5D50] selection:text-white font-alexandria antialiased overflow-x-hidden">
      {/* Floating Audio Player (Bottom-left) */}
      <AudioPlayer
        audioRef={audioRef}
        isPlaying={isPlaying}
        onTogglePlay={handleToggleMusic}
      />

      {/* Section 1: Cover Screen with Warm Kraft & Wax Seal Reveal */}
      <EnvelopeCover
        couple={currentCouple}
        eventDate={currentDate}
        isOpened={isOpened}
        onOpen={handleOpenEnvelope}
        onStartAudio={handleStartAudio}
      />

      {/* Main Page Content (Centered Mobile-First Frame matching reference screenshots) */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-[#F7F3EE] relative overflow-hidden">
        {/* Section 2: Announcement (Top Header Bar, Polaroid Hero & Party Info Card) */}
        <Announcement
          couple={currentCouple}
          eventDate={currentDate}
          onReopenCover={handleReopenEnvelope}
        />

        {/* Section 3: Photo Gallery (3D Coverflow Slider) */}
        <PhotoGallery gallery={invitationConfig.gallery} />

        {/* Section 4: Reception Info, Countdown & Mocha Calendar Card */}
        <CountdownCalendar
          eventDate={currentDate}
          venue={currentVenue}
          couple={currentCouple}
        />

        {/* Section 5: Venue Location with Directions Map */}
        <VenueLocation venue={currentVenue} />

        {/* Section 6: Guestbook & Blessings */}
        <Guestbook couple={currentCouple} />

        {/* Footer */}
        <Footer couple={currentCouple} eventDate={currentDate} />
      </div>
    </div>
  );
}

