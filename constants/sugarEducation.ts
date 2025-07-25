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

export const getRandomFact = (category?: SugarFact['category']): SugarFact => {
  const facts = category 
    ? sugarEducationLibrary.filter(fact => fact.category === category)
    : sugarEducationLibrary;
  
  return facts[Math.floor(Math.random() * facts.length)];
};

export const getFactsByCategory = (category: SugarFact['category']): SugarFact[] => {
  return sugarEducationLibrary.filter(fact => fact.category === category);
};