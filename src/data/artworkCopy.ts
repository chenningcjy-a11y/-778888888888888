export interface GlyphItem {
  id: string;
  char: string;
  pinyin: string;
  poeticNote: string;
  noteIndex: number;
  emphasized?: boolean;
  isPunctuation?: boolean;
}

export const PHRASE_ONE: GlyphItem[] = [
  {
    id: 'g-1',
    char: '能',
    pinyin: 'néng',
    poeticNote: '万千人海之中，何其有幸得以照面',
    noteIndex: 0,
  },
  {
    id: 'g-2',
    char: '遇',
    pinyin: 'yù',
    poeticNote: '不期而至的交汇，恰似四叶草落于掌心',
    noteIndex: 2,
    emphasized: true,
  },
  {
    id: 'g-3',
    char: '见',
    pinyin: 'jiàn',
    poeticNote: '视线穿过夜色与喧嚣，落成清晰的轮廓',
    noteIndex: 3,
    emphasized: true,
  },
  {
    id: 'g-4',
    char: '就',
    pinyin: 'jiù',
    poeticNote: '无需过多铺陈，此刻本身已是答案',
    noteIndex: 4,
  },
  {
    id: 'g-5',
    char: '是',
    pinyin: 'shì',
    poeticNote: '笃定而温柔的确认，落笔无悔',
    noteIndex: 5,
  },
  {
    id: 'g-6',
    char: '缘',
    pinyin: 'yuán',
    poeticNote: '遇见你，便是此刻最温柔的幸运',
    noteIndex: 7,
    emphasized: true,
  },
];

export const PHRASE_TWO: GlyphItem[] = [
  {
    id: 'g-7',
    char: '哪',
    pinyin: 'nǎ',
    poeticNote: '纵然时光短促，亦不问归期与长久',
    noteIndex: 4,
  },
  {
    id: 'g-8',
    char: '怕',
    pinyin: 'pà',
    poeticNote: '纵使错身而过，心底仍留有微光',
    noteIndex: 5,
  },
  {
    id: 'g-9',
    char: '就',
    pinyin: 'jiù',
    poeticNote: '仅仅如此，便已足够铭记很久',
    noteIndex: 6,
  },
  {
    id: 'g-10',
    char: '匆',
    pinyin: 'cōng',
    poeticNote: '风掠过凌晨一点三十二分的街头',
    noteIndex: 8,
    emphasized: true,
  },
  {
    id: 'g-11',
    char: '匆',
    pinyin: 'cōng',
    poeticNote: '步履未停，目光却悄悄停驻了一瞬',
    noteIndex: 9,
    emphasized: true,
  },
  {
    id: 'g-12',
    char: '一',
    pinyin: 'yī',
    poeticNote: '一刹那的凝望，胜过千言万语',
    noteIndex: 7,
  },
  {
    id: 'g-13',
    char: '眼',
    pinyin: 'yǎn',
    poeticNote: '眼波流转之间，将瞬间定格成诗',
    noteIndex: 10,
    emphasized: true,
  },
];

export type FontPresetId = 'cursive' | 'brush' | 'editorial' | 'poetic';

export interface FontPreset {
  id: FontPresetId;
  label: string;
  subtitle: string;
  className: string;
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'cursive',
    label: '行草逸韵',
    subtitle: '志莽行书 · 飘逸连绵',
    className: 'font-cursive',
  },
  {
    id: 'brush',
    label: '楷墨丹青',
    subtitle: '马善政楷 · 苍劲沉稳',
    className: 'font-brush',
  },
  {
    id: 'editorial',
    label: '宋刻金石',
    subtitle: '思源宋体 · 端庄典雅',
    className: 'font-editorial',
  },
  {
    id: 'poetic',
    label: '龙藏飞白',
    subtitle: '龙藏手书 · 疏朗清绝',
    className: 'font-poetic',
  },
];

export type LayoutOrientation = 'horizontal' | 'vertical';
export type CanvasTheme = 'paper' | 'ink';

export const ARCHIVE_PROVENANCE = {
  author: '孔智亦',
  timestamp: '今天 01:32',
  admirer: '槐之冬.',
  copyFull: '能遇见就是缘，哪怕就匆匆一眼',
  motifNote: '遇见你，是我最大的幸运 · Lucky Clover',
  imagePath: '/assets/aistudio/Screenshot_20261121_231254_01e6e8bd.jpg',
};
