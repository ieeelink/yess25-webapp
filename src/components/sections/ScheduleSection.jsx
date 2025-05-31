import React from 'react';

function ScheduleSection() {
  return (
    <div className="flex-none w-screen flex items-center justify-center p-8 bg-white/5 border-t-2 border-b-2 border-white/20" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <div className="w-full max-w-4xl rounded-xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Event Schedule</h2>
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white">Day 1</h3>
            <p className="text-white/80">Opening Ceremony & Keynote Speeches</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white">Day 2</h3>
            <p className="text-white/80">Workshops & Technical Sessions</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-white">Day 3</h3>
            <p className="text-white/80">Networking & Closing Ceremony</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleSection; 