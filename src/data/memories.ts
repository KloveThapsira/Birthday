export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  image: string;
  tag: string;
}

export const MEMORIES_DATA: MemoryItem[] = [
  {
    id: "memory-1",
    title: "Sister by Heart & Soul",
    caption: "Bonds of genuine care and choice often run deeper than anything. Cherishing every lighthearted conversation and thoughtful moment we share.",
    date: "A Cherished Bond",
    image: "/src/assets/images/memory_sibling_joy_1794297840488.jpg",
    tag: "Chosen Sibling"
  },
  {
    id: "memory-2",
    title: "Graceful & Radiant Aura",
    caption: "Lighting up every occasion with your gentle presence, sweet smile, and genuine warmth. A true blessing in all our lives.",
    date: "Celebrations",
    image: "/src/assets/images/memory_festive_smile_1794297842366.jpg",
    tag: "Grace & Joy"
  },
  {
    id: "memory-3",
    title: "Dedication & High Ambitions",
    caption: "Seeing your determination, intellect, and ambitious drive makes me so proud to stand as a supportive brother figure cheering on your journey.",
    date: "Milestones",
    image: "/src/assets/images/memory_dream_milestone_1794297841517.jpg",
    tag: "Future Leader"
  },
  {
    id: "memory-4",
    title: "Serenity & Bright Horizons",
    caption: "May your horizon always be painted with peace, success, and wonderful opportunities. Keep reaching for the highest stars.",
    date: "Adventures Ahead",
    image: "/src/assets/images/memory_sunset_wonder_1794297841891.jpg",
    tag: "Endless Horizons"
  }
];

export default MEMORIES_DATA;
