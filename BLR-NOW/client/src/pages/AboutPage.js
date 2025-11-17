import React from 'react';

// Array of creator names
const creators = [
  { name: 'Adarsh Rajesh' },
  { name: 'Abhinav Agraharam' },
  { name: 'Aadhavan Muthusamy' }
];

// Individual card for each creator
function CreatorCard({ name }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="creator-card">
      <div className="creator-avatar">
        <span>{initial}</span>
      </div>
      <h3>{name}</h3>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Our Vision: Reconnecting the 'Hyperlocal'</h1>
        <h2>We're more connected, yet more disconnected from our community.</h2>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3>The Problem</h3>
          <p>
            We live in the most connected time in history, yet it's never been harder to find a simple
            pickup football game, a spontaneous art workshop, or a study group happening
            <i>right around the corner</i>. We're all plugged into the world, but we've become
            disconnected from our own neighborhoods.
          </p>
          <p>
            Crucial local information is fragmented, scattered across private WhatsApp groups,
            temporary Instagram stories, and hidden college notice boards. Major platforms
            are focused on large, ticketed, commercial events, completely ignoring the
            vibrant, spontaneous pulse of local community life. We call this the 'hyperlocal disconnect'.
          </p>
        </div>

        <div className="about-section">
          <h3>The Solution: BLR-NOW</h3>
          <p>
            BLR-NOW is our solution. It's not another massive event platform.
            It's a real-time, map-first notice board for your community.
            It’s for the spontaneous, the local, the <strong>now</strong>.
          </p>
          <p>
            Our mission is simple: to break down these information silos and make it
            effortlessly simple to find and share the genuine community connections
            happening just outside your door.
          </p>
        </div>

        <div className="about-section">
          <h2>Meet the Creators</h2>
          <div className="team-grid">
            {creators.map((creator) => (
              <CreatorCard key={creator.name} name={creator.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;