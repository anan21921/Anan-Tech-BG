
export type DressType = 'Formal Suit' | 'White Shirt' | 'Blue Shirt' | 'Panjabi' | 'Saree' | 'No Change';

export interface EditorConfig {
  bgColor: string;
  dressType: DressType;
  enhanceFace: boolean;
  smoothSkin: boolean;
  lightingAdjustment: 'Normal' | 'Bright' | 'Studio';
}

export interface ProcessingState {
  isProcessing: boolean;
  status: string;
  progress: number;
}
