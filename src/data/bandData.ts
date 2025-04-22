
export const tracks = [
  {
    id: 1,
    title: "Carnival of Dreams",
    duration: "3:45",
    audioSrc: "/audio/track1.mp3", // Dummy path
    albumArt: "https://images.unsplash.com/photo-1588479839125-3a70c4a072c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Tightrope Walker",
    duration: "4:12",
    audioSrc: "/audio/track2.mp3", // Dummy path
    albumArt: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "The Ringmaster",
    duration: "3:28",
    audioSrc: "/audio/track3.mp3", // Dummy path
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Fire Dancer",
    duration: "5:03",
    audioSrc: "/audio/track4.mp3", // Dummy path
    albumArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    title: "Acrobat's Flight",
    duration: "3:58",
    audioSrc: "/audio/track5.mp3", // Dummy path
    albumArt: "https://images.unsplash.com/photo-1470019693664-1d202d2c0907?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

export const events = [
  {
    id: 1,
    date: "2025-05-15",
    venue: "The Blue Note",
    city: "Brooklyn",
    country: "USA",
    ticketLink: "https://example.com/tickets/1",
  },
  {
    id: 2,
    date: "2025-05-22",
    venue: "Soundwave Club",
    city: "Los Angeles",
    country: "USA",
    ticketLink: "https://example.com/tickets/2",
  },
  {
    id: 3,
    date: "2025-06-05",
    venue: "The Roundhouse",
    city: "London",
    country: "UK",
    ticketLink: "https://example.com/tickets/3",
  },
  {
    id: 4,
    date: "2025-06-12",
    venue: "Electric Ballroom",
    city: "Paris",
    country: "France",
    ticketLink: "https://example.com/tickets/4",
    isSoldOut: true,
  },
  {
    id: 5,
    date: "2025-06-19",
    venue: "Circus Theatre",
    city: "Berlin",
    country: "Germany",
  }
];

export const bandMembers = [
  {
    id: 1,
    name: "Irene Castillo",
    instrument: "Lead Vocals & Guitar",
    bio: "The founder and visionary behind Irene's Circus, Irene brings her powerful vocals and creative songwriting to the forefront. With a background in theatre and music, she created the band to merge her two passions into one spectacular show.",
    image: "https://images.unsplash.com/photo-1605722243720-8d98f835dbeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    name: "Max Thornton",
    instrument: "Lead Guitar & Backing Vocals",
    bio: "A virtuoso guitarist with a flair for the dramatic, Max adds technical brilliance and theatrical energy to every performance. When not performing with the band, he composes film scores and teaches master classes.",
    image: "https://images.unsplash.com/photo-1618254170399-921fc91b1d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    name: "Sophia Lee",
    instrument: "Bass & Synths",
    bio: "With her unique approach to the bass guitar and electronic elements, Sophia creates the foundation of the band's distinctive sound. A classically trained musician who found her home in the alternative scene.",
    image: "https://images.unsplash.com/photo-1557186841-97583421ec1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    name: "Leo Drummond",
    instrument: "Drums & Percussion",
    bio: "The rhythmic heartbeat of Irene's Circus, Leo brings a combination of precision and wild energy to every performance. His background in jazz and rock fusion gives the band's sound its unique groove.",
    image: "https://images.unsplash.com/photo-1581297848080-c4482d824e2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
  }
];

export const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Irene's Circus performing on stage",
    span: "col" as "col"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Concert crowd",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Band backstage",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Promotional photoshoot",
    span: "row" as "row"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Studio recording session",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1574861236373-2e46a93ad15f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Acoustic set",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1528489290689-d5e7a2a1eb7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Festival performance",
    span: "both" as "both"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Fan meet and greet",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1599137248983-e6a182111c46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    alt: "Band members candid",
  }
];
