export const interestedIdeas = [
  "Basketball",
  "Football",
  "Tennis",
  "Cricket",
  "Baseball",
  "Swimming",
  "Running",
  "Cycling",
  "Hiking",
  "Gymnastics",
  "Martial Arts",
  "Rugby",
  "Volleyball",
  "Badminton",
  "Golf",
  "Surfing",
  "Skiing",
  "Snowboarding",
] as const;
export type InterestedIdea = (typeof interestedIdeas)[number];

export const HOROSCOPE_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

export const uniqueChineseZodiacAnimals = [
  "Rabbit",
  "Tiger",
  "Ox",
  "Rat",
  "Pig",
  "Dog",
  "Rooster",
  "Monkey",
  "Goat",
  "Horse",
  "Snake",
  "Dragon",
] as const;

export type Zodiac = (typeof uniqueChineseZodiacAnimals)[number];
export type HoroscopeSign = (typeof HOROSCOPE_SIGNS)[number];
