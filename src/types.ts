export type Language = 'en' | 'hi';

export type ActiveToolId = 
  | 'pdf-tools'
  | 'image-compressor'
  | 'keyword-generator'
  | 'financial-calculator'
  | 'invitation-maker'
  | 'qr-generator';

export interface ToolDefinition {
  id: ActiveToolId;
  title: string;
  titleHi: string;
  tagline: string;
  taglineHi: string;
  description: string;
  descriptionHi: string;
  badge: string;
  category: string;
  color: string;
  accentBg: string;
  iconName: string;
}

export interface ComingSoonTool {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: string;
  icon: string;
  targetRelease: string;
}
