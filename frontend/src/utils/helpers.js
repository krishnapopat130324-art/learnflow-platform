export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700';
    case 'advanced': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const calculateLevel = (xp) => {
  return Math.floor(xp / 200) + 1;
};

export const calculateNextLevelXP = (level) => {
  return level * 200;
};

export const calculateXPProgress = (xp) => {
  const level = calculateLevel(xp);
  const nextLevelXP = calculateNextLevelXP(level);
  const currentLevelXP = (level - 1) * 200;
  const xpInCurrentLevel = xp - currentLevelXP;
  return (xpInCurrentLevel / 200) * 100;
};