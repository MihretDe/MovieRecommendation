import Mood from '../Models/Mood';

// Example mapping: TMDb Genre IDs → Mood Names
const genreMoodMap: Record<number, string> = {
  35: 'happy',      // Comedy
  18: 'sad',        // Drama
  28: 'excited',    // Action
  27: 'scared',     // Horror
  10749: 'romantic',
  16: 'nostalgic',  // Animation
  99: 'relaxed'     // Documentary
};

export const mapGenresToMoodIds = async (genreIds: number[]): Promise<string[]> => {
  const moods: { _id: any; name: string }[] = await Mood.find({});
  const moodIds: Set<string> = new Set();

  for (const genreId of genreIds) {
    const moodName = genreMoodMap[genreId];
    if (!moodName) continue;

    const mood = moods.find((m) => m.name === moodName);
    if (mood) moodIds.add(mood._id.toString());
  }

  return Array.from(moodIds);
};