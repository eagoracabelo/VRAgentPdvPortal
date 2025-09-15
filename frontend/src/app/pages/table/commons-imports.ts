import { VrcTableModule } from '@vrsoftbr/vr-table';

export const commonsImports = [
  VrcTableModule.forRoot({
    messages: {
      emptyMessage: 'MESSAGE.NO-DATA', // Message to show when array is presented, but contains no values
      totalMessage: 'MESSAGE.TOTAL', // Footer total message
      selectedMessage: 'MESSAGE.SELECTED', // Footer selected message
    },
  }),
];
