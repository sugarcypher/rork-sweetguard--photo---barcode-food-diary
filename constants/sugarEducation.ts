export interface SugarFact {
  id: string;
  title: string;
  content: string;
  category: 'addiction' | 'health' | 'candida' | 'brain' | 'statistics';
  severity: 'info' | 'warning' | 'critical';
}

export const sugarEducationLibrary: SugarFact[] = [
  {
    id: 'brain-reward-1',
    title: 'Sugar & Your Brain',
    content: 'Sugar activates the brain\'s reward circuits, releasing dopamine and opioids, which can cause craving and reinforce habitual consumption.',
    category: 'brain',
    severity: 'warning'
  },
  {
    id: 'addiction-behavior-1',
    title: 'Addictive Behaviors',
    content: 'Behavioral studies in animals show that sugar can lead to behaviors similar to drug addiction, including bingeing, craving, withdrawal, and relapse.',
    category: 'addiction',
    severity: 'critical'
  },
  {
    id: 'addiction-preference-1',
    title: 'Sugar vs Cocaine',
    content: 'Some studies on rats showed the animals sometimes preferred sugar over cocaine, suggesting a potent effect on the brain\'s reward system.',
    category: 'addiction',
    severity: 'critical'
  },
  {
    id: 'human-addiction-1',
    title: 'Human Sugar Response',
    content: 'In humans, sugar can trigger cravings and compulsive eating, but most clinical experts state that it does not meet all the criteria for addiction as defined for substances like drugs or alcohol.',
    category: 'addiction',
    severity: 'info'
  },
  {
    id: 'candida-cycle-1',
    title: 'The Candida Connection',
    content: 'Sugar feeds Candida albicans, a yeast naturally present in the gut, encouraging its overgrowth when sugar intake is high.',
    category: 'candida',
    severity: 'warning'
  },
  {
    id: 'candida-cravings-1',
    title: 'Yeast-Driven Cravings',
    content: 'As Candida multiplies, it can trigger and intensify cravings for sugar and refined carbohydrates, because the yeast thrives on these nutrients.',
    category: 'candida',
    severity: 'warning'
  },
  {
    id: 'candida-double-1',
    title: 'Doubly Addictive Effect',
    content: 'The "doubly addictive candida effect" creates a vicious cycle: sugar consumption → Candida overgrowth → heightened sugar cravings → more sugar consumption.',
    category: 'candida',
    severity: 'critical'
  },
  {
    id: 'candida-symptoms-1',
    title: 'Beyond Cravings',
    content: 'Candida overgrowth may cause digestive issues, brain fog, fatigue, mood changes, and other health problems, further complicating the sugar cycle.',
    category: 'candida',
    severity: 'warning'
  },
  {
    id: 'health-deaths-1',
    title: 'Global Impact',
    content: '15 million deaths per year are directly or indirectly caused by excessive sugar consumption worldwide.',
    category: 'statistics',
    severity: 'critical'
  },
  {
    id: 'health-diabetes-1',
    title: 'Diabetes Risk',
    content: 'Consuming just one sugary drink per day increases your risk of developing type 2 diabetes by 26%.',
    category: 'health',
    severity: 'warning'
  },
  {
    id: 'health-heart-1',
    title: 'Heart Disease Link',
    content: 'People who consume 25% or more of their daily calories from sugar are twice as likely to die from heart disease.',
    category: 'health',
    severity: 'critical'
  },
  {
    id: 'brain-memory-1',
    title: 'Memory Impact',
    content: 'High sugar intake can impair memory formation and learning ability by affecting brain-derived neurotrophic factor (BDNF).',
    category: 'brain',
    severity: 'warning'
  }
];

export const getSplashScreenFacts = (): SugarFact[] => {
  return sugarEducationLibrary.filter(fact => 
    fact.severity === 'critical' || fact.category === 'brain' || fact.category === 'candida'
  );
};

export interface InspirationalQuote {
  id: string;
  text: string;
  author?: string;
}

export const inspirationalQuotes: InspirationalQuote[] = [
  {
    id: 'health-1',
    text: 'Every small step towards better health is a victory worth celebrating.',
  },
  {
    id: 'health-2',
    text: 'Your body is your temple. Keep it pure and clean for the soul to reside in.',
    author: 'B.K.S. Iyengar'
  },
  {
    id: 'health-3',
    text: 'Take care of your body. It\'s the only place you have to live.',
    author: 'Jim Rohn'
  },
  {
    id: 'health-4',
    text: 'Health is not about the weight you lose, but about the life you gain.',
  },
  {
    id: 'health-5',
    text: 'The groundwork for all happiness is good health.',
    author: 'Leigh Hunt'
  },
  {
    id: 'health-6',
    text: 'Your health is an investment, not an expense.',
  },
  {
    id: 'health-7',
    text: 'A healthy outside starts from the inside.',
    author: 'Robert Urich'
  },
  {
    id: 'health-8',
    text: 'The first wealth is health.',
    author: 'Ralph Waldo Emerson'
  },
  {
    id: 'health-9',
    text: 'To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.',
    author: 'Buddha'
  },
  {
    id: 'health-10',
    text: 'Health is a state of complete harmony of the body, mind and spirit.',
    author: 'B.K.S. Iyengar'
  },
  {
    id: 'health-11',
    text: 'The doctor of the future will give no medicine, but will interest his patients in the care of the human frame, in diet, and in the cause and prevention of disease.',
    author: 'Thomas Edison'
  },
  {
    id: 'health-12',
    text: 'He who conquers others is strong; he who conquers himself is mighty.',
    author: 'Lao Tzu'
  },
  {
    id: 'health-13',
    text: 'What we plant in the soil of contemplation, we shall reap in the harvest of action.',
    author: 'Meister Eckhart'
  },
  {
    id: 'health-14',
    text: 'The wise find pleasure in water; the virtuous find pleasure in hills.',
    author: 'Confucius'
  },
  {
    id: 'health-15',
    text: 'Prevention is better than cure.',
    author: 'Desiderius Erasmus'
  },
  {
    id: 'sugar-1',
    text: 'Every time you choose water over soda, you choose health over habit.',
  },
  {
    id: 'sugar-2',
    text: 'Breaking free from sugar is breaking free from a cycle that doesn\'t serve you.',
  },
  {
    id: 'sugar-3',
    text: 'Your future self will thank you for the healthy choices you make today.',
  },
  {
    id: 'sugar-4',
    text: 'Awareness is the first step to transformation.',
  },
  {
    id: 'sugar-5',
    text: 'You have the power to rewrite your relationship with food.',
  },
  {
    id: 'sugar-6',
    text: 'Sweet freedom comes from saying no to artificial sweetness.',
  },
  {
    id: 'sugar-7',
    text: 'Real energy comes from nourishment, not from sugar spikes.',
  },
  {
    id: 'sugar-8',
    text: 'Choose foods that love you back.',
  },
  {
    id: 'sugar-9',
    text: 'Your taste buds can be retrained to appreciate natural flavors.',
  },
  {
    id: 'sugar-10',
    text: 'Every healthy choice is a step towards the person you want to become.',
  }
];

export const getRandomFact = (category?: SugarFact['category']): SugarFact => {
  const facts = category 
    ? sugarEducationLibrary.filter(fact => fact.category === category)
    : sugarEducationLibrary;
  
  return facts[Math.floor(Math.random() * facts.length)];
};

export const getRandomQuote = (): InspirationalQuote => {
  return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
};

export const getFactsByCategory = (category: SugarFact['category']): SugarFact[] => {
  return sugarEducationLibrary.filter(fact => fact.category === category);
};