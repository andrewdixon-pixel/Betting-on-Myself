// Starter content. Sources are retained for editorial verification; the game reveal stays fast.
export const questions = [
  // Science (15)
  { id: 'moon-distance-thousands', category: 'Science', prompt: 'About how many thousand miles away is the Moon from Earth on average?', unit: 'thousand miles', answer: 239, source: 'NASA Science', answerType: 'accepted_estimate' },
  { id: 'moon-diameter-miles', category: 'Science', prompt: 'How many miles across is the Moon?', unit: 'miles', answer: 2159, source: 'NASA Glenn Research Center' },
  { id: 'mars-day-minutes', category: 'Science', prompt: 'About how many minutes long is one day on Mars?', unit: 'minutes', answer: 1480, source: 'NASA JPL', answerType: 'accepted_estimate' },
  { id: 'mars-diameter-miles', category: 'Science', prompt: 'How many miles across is Mars at its widest point?', unit: 'miles', answer: 4212, source: 'NASA JPL' },
  { id: 'mars-temperature-f', category: 'Science', prompt: 'What is Mars’s average surface temperature in degrees Fahrenheit?', unit: 'degrees Fahrenheit', answer: -64, source: 'NASA JPL' },
  { id: 'human-genome-billions', category: 'Science', prompt: 'About how many billion base pairs are in the human genome?', unit: 'billion base pairs', answer: 3.2, source: 'National Human Genome Research Institute', answerType: 'accepted_estimate' },
  { id: 'active-satellites-thousands', category: 'Science', prompt: 'About how many thousand active satellites were orbiting Earth in 2024?', unit: 'thousand satellites', answer: 10.2, source: 'Union of Concerned Scientists satellite database', answerType: 'accepted_estimate' },
  { id: 'volcanoes', category: 'Science', prompt: 'About how many volcanoes are listed in NOAA’s global volcano-location database?', unit: 'volcanoes', answer: 1600, source: 'NOAA NCEI', answerType: 'accepted_estimate' },
  { id: 'blue-whale-weight', category: 'Science', prompt: 'About how many hundred thousand pounds can a blue whale weigh?', unit: 'hundred thousand pounds', answer: 3.3, source: 'NOAA Fisheries', answerType: 'accepted_estimate' },
  { id: 'redwoods', category: 'Science', prompt: 'About how many years can a giant sequoia live?', unit: 'years', answer: 3000, source: 'National Park Service', answerType: 'accepted_estimate' },
  { id: 'light-speed-thousands', category: 'Science', prompt: 'About how many thousand miles does light travel in one second?', unit: 'thousand miles', answer: 186, source: 'NASA', answerType: 'accepted_estimate' },
  { id: 'earth-age-billions', category: 'Science', prompt: 'About how many billion years old is Earth?', unit: 'billion years', answer: 4.5, source: 'U.S. Geological Survey', answerType: 'accepted_estimate' },
  { id: 'species-millions', category: 'Science', prompt: 'About how many million species of plants, animals, and other life forms are estimated to exist on Earth?', unit: 'million species', answer: 8.7, source: 'Smithsonian National Museum of Natural History', answerType: 'accepted_estimate' },
  { id: 'heartbeats-day', category: 'Science', prompt: 'About how many times does the average human heart beat in one day?', unit: 'heartbeats', answer: 100000, source: 'American Heart Association', answerType: 'accepted_estimate' },
  { id: 'olympus-mons-height', category: 'Science', prompt: 'About how many miles high is Olympus Mons, the tallest volcano on Mars?', unit: 'miles', answer: 16, source: 'NASA JPL', answerType: 'accepted_estimate' },

  // History (15)
  { id: 'great-wall-miles', category: 'History', prompt: 'About how many miles long is the Great Wall of China, including all sections?', unit: 'miles', answer: 13171, source: 'UNESCO / Chinese State Administration of Cultural Heritage', answerType: 'accepted_estimate' },
  { id: 'eiffel-steps', category: 'History', prompt: 'How many steps are there to the top of the Eiffel Tower?', unit: 'steps', answer: 1665, source: 'Société d’Exploitation de la Tour Eiffel' },
  { id: 'us-population-2020-millions', category: 'History', prompt: 'About how many million people was the U.S. population based on the 2020 Census?', unit: 'million people', answer: 331, source: 'U.S. Census Bureau', answerType: 'accepted_estimate' },
  { id: 'wwi-days', category: 'History', prompt: 'How many days did World War I last?', unit: 'days', answer: 1566, source: 'Historical calendar calculation' },
  { id: 'constitution-words', category: 'History', prompt: 'About how many words are in the U.S. Constitution, including amendments?', unit: 'words', answer: 7591, source: 'National Archives', answerType: 'accepted_estimate' },
  { id: 'louvre-artworks-thousands', category: 'History', prompt: 'About how many thousand works of art does the Louvre manage?', unit: 'thousand works', answer: 615, source: 'Musée du Louvre', answerType: 'accepted_estimate' },
  { id: 'terracotta-warriors', category: 'History', prompt: 'About how many Terracotta Army figures have been found near Xi’an?', unit: 'figures', answer: 8000, source: 'UNESCO', answerType: 'accepted_estimate' },
  { id: 'boston-tea-chests', category: 'History', prompt: 'How many tea chests were thrown into Boston Harbor during the Boston Tea Party?', unit: 'tea chests', answer: 342, source: 'Boston Tea Party Ships & Museum' },
  { id: 'great-fire-houses', category: 'History', prompt: 'About how many houses were destroyed in the Great Fire of London?', unit: 'houses', answer: 13200, source: 'Museum of London', answerType: 'accepted_estimate' },
  { id: 'roman-roads-miles', category: 'History', prompt: 'About how many miles of paved roads did the Roman Empire build?', unit: 'miles', answer: 50000, source: 'Encyclopaedia Britannica', answerType: 'accepted_estimate' },
  { id: 'mayflower-passengers', category: 'History', prompt: 'How many passengers were aboard the Mayflower when it left England?', unit: 'passengers', answer: 102, source: 'Pilgrim Hall Museum' },
  { id: 'liberty-bell-weight', category: 'History', prompt: 'How many pounds did the Liberty Bell weigh when it was cast?', unit: 'pounds', answer: 2080, source: 'National Park Service' },
  { id: 'statue-liberty-height', category: 'History', prompt: 'How many feet tall is the Statue of Liberty from the ground to the tip of the torch?', unit: 'feet', answer: 305, source: 'National Park Service' },
  { id: 'gutenberg-bible-pages', category: 'History', prompt: 'How many pages were in the original Gutenberg Bible?', unit: 'pages', answer: 1286, source: 'Library of Congress' },
  { id: 'lewis-clark-days', category: 'History', prompt: 'How many days did the Lewis and Clark Expedition last?', unit: 'days', answer: 863, source: 'National Park Service' },

  // Sports (15)
  { id: 'paris-athletes-thousands', category: 'Sports', prompt: 'About how many thousand athletes competed at the Paris 2024 Summer Olympics?', unit: 'thousand athletes', answer: 10.7, source: 'International Olympic Committee', answerType: 'accepted_estimate' },
  { id: 'marathon-miles', category: 'Sports', prompt: 'How many miles is an official marathon?', unit: 'miles', answer: 26.2, source: 'World Athletics' },
  { id: 'golf-playoff-holes', category: 'Sports', prompt: 'How many holes were played in the longest PGA Tour playoff?', unit: 'holes', answer: 11, source: 'PGA Tour' },
  { id: 'world-cup-trophy-inches', category: 'Sports', prompt: 'How many inches tall is the FIFA World Cup Trophy?', unit: 'inches', answer: 14.5, source: 'FIFA' },
  { id: 'stanley-cup-inches', category: 'Sports', prompt: 'How many inches tall is the Stanley Cup?', unit: 'inches', answer: 35.25, source: 'Hockey Hall of Fame' },
  { id: 'mlb-mound-distance-feet', category: 'Sports', prompt: 'How many feet are there from the pitching rubber to home plate in Major League Baseball?', unit: 'feet', answer: 60.5, source: 'Official Baseball Rules' },
  { id: 'nhl-rink-area', category: 'Sports', prompt: 'How many square feet is a standard NHL rink surface?', unit: 'square feet', answer: 17000, source: 'NHL rulebook' },
  { id: 'football-field-yards', category: 'Sports', prompt: 'How many yards long is an American football field including both end zones?', unit: 'yards', answer: 120, source: 'NFL rulebook' },
  { id: 'basketball-rim-inches', category: 'Sports', prompt: 'How many inches is the inside diameter of a regulation basketball rim?', unit: 'inches', answer: 18, source: 'NBA rulebook' },
  { id: 'tennis-court-feet', category: 'Sports', prompt: 'How many feet long is a regulation tennis court?', unit: 'feet', answer: 78, source: 'International Tennis Federation' },
  { id: 'golf-hole-inches', category: 'Sports', prompt: 'How many inches wide is a regulation golf hole?', unit: 'inches', answer: 4.25, source: 'USGA' },
  { id: 'bowling-ball-pounds', category: 'Sports', prompt: 'What is the maximum weight, in pounds, of a regulation bowling ball?', unit: 'pounds', answer: 16, source: 'United States Bowling Congress' },
  { id: 'baseball-stitches', category: 'Sports', prompt: 'How many stitches are on a regulation Major League Baseball?', unit: 'stitches', answer: 108, source: 'Major League Baseball' },
  { id: 'nfl-goalpost-width', category: 'Sports', prompt: 'How many feet wide are NFL goalposts?', unit: 'feet', answer: 18.5, source: 'NFL rulebook' },
  { id: 'hockey-puck-ounces', category: 'Sports', prompt: 'How many ounces can a regulation hockey puck weigh at most?', unit: 'ounces', answer: 6, source: 'NHL rulebook' }
];

export function questionsForPack(pack) {
  if (pack === 'Mixed') return questions;
  const selected = questions.filter(question => question.category === pack);
  return selected.length ? selected : questions;
}
