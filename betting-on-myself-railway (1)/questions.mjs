// Starter content. Sources are retained for editorial verification; the game reveal stays fast.
export const questions = [
  // Science (10)
  { id: 'moon-diameter', category: 'Science', prompt: 'How many kilometers is the Moon’s diameter?', unit: 'kilometers', answer: 3475, source: 'NASA JPL' },
  { id: 'moon-distance', category: 'Science', prompt: 'How many kilometers is the Moon’s average distance from Earth?', unit: 'kilometers', answer: 383500, source: 'NASA JPL' },
  { id: 'mars-diameter', category: 'Science', prompt: 'How many kilometers is the diameter of Mars?', unit: 'kilometers', answer: 6779, source: 'NASA planetary fact sheet' },
  { id: 'earth-diameter', category: 'Science', prompt: 'How many kilometers is Earth’s equatorial diameter?', unit: 'kilometers', answer: 12756, source: 'NASA planetary fact sheet' },
  { id: 'volcanoes', category: 'Science', prompt: 'About how many volcano locations are listed in NOAA’s global database?', unit: 'volcanoes', answer: 1600, source: 'NOAA NCEI', answerType: 'accepted_estimate' },
  { id: 'active-satellites', category: 'Science', prompt: 'About how many active satellites were orbiting Earth in 2024?', unit: 'satellites', answer: 10200, source: 'Union of Concerned Scientists satellite database', answerType: 'accepted_estimate' },
  { id: 'human-genome', category: 'Science', prompt: 'About how many base pairs are in the human genome?', unit: 'base pairs', answer: 3200000000, source: 'National Human Genome Research Institute', answerType: 'accepted_estimate' },
  { id: 'languages', category: 'Science', prompt: 'About how many living languages are spoken worldwide?', unit: 'languages', answer: 7000, source: 'Ethnologue', answerType: 'accepted_estimate' },
  { id: 'bluemass', category: 'Science', prompt: 'About how many kilograms can an adult blue whale weigh?', unit: 'kilograms', answer: 180000, source: 'NOAA Fisheries', answerType: 'accepted_estimate' },
  { id: 'redwoods', category: 'Science', prompt: 'About how many years can a giant sequoia live?', unit: 'years', answer: 3000, source: 'National Park Service', answerType: 'accepted_estimate' },

  // History (10)
  { id: 'great-wall', category: 'History', prompt: 'How many kilometers long is the Great Wall of China, including all sections?', unit: 'kilometers', answer: 21196, source: 'UNESCO / Chinese State Administration of Cultural Heritage' },
  { id: 'eiffel-steps', category: 'History', prompt: 'How many steps are there to the top of the Eiffel Tower?', unit: 'steps', answer: 1665, source: 'Société d’Exploitation de la Tour Eiffel' },
  { id: 'us-population-2020', category: 'History', prompt: 'What was the United States population in the 2020 Census?', unit: 'people', answer: 331449281, source: 'U.S. Census Bureau' },
  { id: 'wwi-days', category: 'History', prompt: 'How many days did World War I last, from July 28, 1914 to November 11, 1918?', unit: 'days', answer: 1566, source: 'Historical calendar calculation' },
  { id: 'constitution-words', category: 'History', prompt: 'About how many words are in the U.S. Constitution, including amendments?', unit: 'words', answer: 7591, source: 'National Archives', answerType: 'accepted_estimate' },
  { id: 'louvre-artworks', category: 'History', prompt: 'About how many works of art does the Louvre manage?', unit: 'works', answer: 615000, source: 'Musée du Louvre', answerType: 'accepted_estimate' },
  { id: 'terracotta-warriors', category: 'History', prompt: 'About how many Terracotta Army figures have been found near Xi’an?', unit: 'figures', answer: 8000, source: 'UNESCO', answerType: 'accepted_estimate' },
  { id: 'boston-tea-chests', category: 'History', prompt: 'How many tea chests were thrown into Boston Harbor during the Boston Tea Party?', unit: 'tea chests', answer: 342, source: 'Boston Tea Party Ships & Museum' },
  { id: 'great-fire-houses', category: 'History', prompt: 'About how many houses were destroyed in the Great Fire of London?', unit: 'houses', answer: 13200, source: 'Museum of London', answerType: 'accepted_estimate' },
  { id: 'roman-roads', category: 'History', prompt: 'About how many kilometers of paved roads did the Roman Empire build?', unit: 'kilometers', answer: 80000, source: 'Encyclopaedia Britannica', answerType: 'accepted_estimate' },

  // Geography (10)
  { id: 'antarctica-area', category: 'Geography', prompt: 'About how many square kilometers is Antarctica?', unit: 'square kilometers', answer: 14000000, source: 'British Antarctic Survey', answerType: 'accepted_estimate' },
  { id: 'sahara-area', category: 'Geography', prompt: 'About how many square kilometers is the Sahara Desert?', unit: 'square kilometers', answer: 9200000, source: 'Encyclopaedia Britannica', answerType: 'accepted_estimate' },
  { id: 'everest-height', category: 'Geography', prompt: 'How many meters above sea level is Mount Everest?', unit: 'meters', answer: 8849, source: 'Survey Department of Nepal' },
  { id: 'mariana-depth', category: 'Geography', prompt: 'About how many meters deep is Challenger Deep in the Mariana Trench?', unit: 'meters', answer: 10935, source: 'NOAA Ocean Exploration', answerType: 'accepted_estimate' },
  { id: 'canada-coast', category: 'Geography', prompt: 'About how many kilometers of coastline does Canada have?', unit: 'kilometers', answer: 202080, source: 'Natural Resources Canada', answerType: 'accepted_estimate' },
  { id: 'amazon-length', category: 'Geography', prompt: 'About how many kilometers long is the Amazon River?', unit: 'kilometers', answer: 6400, source: 'Encyclopaedia Britannica', answerType: 'accepted_estimate' },
  { id: 'greenland-area', category: 'Geography', prompt: 'How many square kilometers is Greenland?', unit: 'square kilometers', answer: 2166086, source: 'CIA World Factbook' },
  { id: 'baikal-volume', category: 'Geography', prompt: 'About how many cubic kilometers of water does Lake Baikal contain?', unit: 'cubic kilometers', answer: 23615, source: 'UNESCO', answerType: 'accepted_estimate' },
  { id: 'australia-coast', category: 'Geography', prompt: 'About how many kilometers of mainland coastline does Australia have?', unit: 'kilometers', answer: 34218, source: 'Geoscience Australia', answerType: 'accepted_estimate' },
  { id: 'victoria-area', category: 'Geography', prompt: 'About how many square kilometers is Lake Victoria?', unit: 'square kilometers', answer: 68800, source: 'Encyclopaedia Britannica', answerType: 'accepted_estimate' },

  // Sports (10)
  { id: 'paris-athletes', category: 'Sports', prompt: 'About how many athletes competed at the Paris 2024 Summer Olympics?', unit: 'athletes', answer: 10714, source: 'International Olympic Committee', answerType: 'accepted_estimate' },
  { id: 'marathon-meters', category: 'Sports', prompt: 'How many meters is an official marathon?', unit: 'meters', answer: 42195, source: 'World Athletics' },
  { id: 'golf-holes', category: 'Sports', prompt: 'How many holes were played in the longest professional golf playoff on the PGA Tour?', unit: 'holes', answer: 11, source: 'PGA Tour' },
  { id: 'world-cup-trophy', category: 'Sports', prompt: 'How many centimeters tall is the FIFA World Cup Trophy?', unit: 'centimeters', answer: 36.8, source: 'FIFA' },
  { id: 'stanley-cup-height', category: 'Sports', prompt: 'How many centimeters tall is the Stanley Cup?', unit: 'centimeters', answer: 89.54, source: 'Hockey Hall of Fame' },
  { id: 'mlb-mound-distance', category: 'Sports', prompt: 'How many inches are there from the pitching rubber to home plate in Major League Baseball?', unit: 'inches', answer: 726, source: 'Official Baseball Rules' },
  { id: 'nhl-rink-area', category: 'Sports', prompt: 'How many square feet is a standard NHL rink surface?', unit: 'square feet', answer: 17000, source: 'NHL rulebook' },
  { id: 'football-field', category: 'Sports', prompt: 'How many yards long is an American football field including both end zones?', unit: 'yards', answer: 120, source: 'NFL rulebook' },
  { id: 'basketball-rim', category: 'Sports', prompt: 'How many inches is the inside diameter of a regulation basketball rim?', unit: 'inches', answer: 18, source: 'NBA rulebook' },
  { id: 'tennis-court', category: 'Sports', prompt: 'How many feet long is a regulation tennis court?', unit: 'feet', answer: 78, source: 'International Tennis Federation' }
];

export function questionsForPack(pack) {
  if (pack === 'Mixed') return questions;
  const selected = questions.filter(question => question.category === pack);
  return selected.length ? selected : questions;
}
