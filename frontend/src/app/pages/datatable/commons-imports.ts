import {
  VrcIconModule,
  VrcInputModule,
  VrcSelectModule,
  VrcTabsModule,
  VrcTooltipModule,
} from '@vrsoftbr/vr-components';
import { VrcDatatablesModule } from '@vrsoftbr/vrc-datatables';

import { TranslatorModule } from '../../shared/translator/translator.module';

export const commonsImports = [
  VrcSelectModule,
  VrcTabsModule,
  VrcIconModule,
  VrcInputModule,
  VrcTooltipModule,
  TranslatorModule,
  VrcDatatablesModule,
];
