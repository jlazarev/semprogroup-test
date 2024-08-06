import {ieFix} from './utils/ie-fix.js';
import {iosVhFix} from './utils/ios-vh-fix.js';

import {initModals} from './modules/init-modals.js';
import './modules/menu.js';
import './modules/login-popup.js';
import './modules/init-swiper.js';
import './modules/arrow.js';
import './modules/modal-form.js';
import './modules/payments.js';
import './modules/encode-number.js';
// import './modules/yandex-metrika.js';
import './modules/range-slider.js';

// Utils
// ---------------------------------

ieFix();
iosVhFix();

// Modules
// ---------------------------------

initModals();
