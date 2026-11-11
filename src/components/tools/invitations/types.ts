export interface IndianWeddingCardData {
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  invitationMessage: string;
  familyName: string;
  subTitle?: string;
  badgeText?: string;
}

export const DEFAULT_ROYAL_TRADITIONAL_DATA: IndianWeddingCardData = {
  groomName: 'Aarav Sharma',
  brideName: 'Ananya Verma',
  groomParents: 'Mr. Rajesh & Mrs. Sunita Sharma',
  brideParents: 'Mr. Vikram & Mrs. Rekha Verma',
  eventDate: 'Sunday, 14 December 2026',
  eventTime: '7:00 PM Onwards',
  venueName: 'The Grand Heritage Palace',
  venueAddress: 'Grand Ballroom, Heritage Boulevard, MG Road, Bengaluru',
  invitationMessage:
    'With the blessings of our family, we request the pleasure of your company on this auspicious occasion.',
  familyName: 'Sharma & Verma Family',
  subTitle: 'Wedding Ceremony',
  badgeText: 'Your Presence will make our day special!',
};

export const DEFAULT_PURPLE_FLORAL_DATA: IndianWeddingCardData = {
  groomName: 'Rohan Mehra',
  brideName: 'Tara Kapoor',
  groomParents: 'Mr. Arvind & Mrs. Shalini Mehra',
  brideParents: 'Mr. Deepak & Mrs. Pooja Kapoor',
  eventDate: 'Friday, 18 December 2026',
  eventTime: '6:30 PM Onwards',
  venueName: 'The Lavender Royale Banquet',
  venueAddress: 'Crystal Palace, Orchid Valley Road, Mumbai, India',
  invitationMessage:
    'Your presence will add joy to our special celebration as we begin our new journey together.',
  familyName: 'Mehra & Kapoor Family',
  subTitle: 'Wedding Ceremony',
  badgeText: 'Please Join Us',
};
