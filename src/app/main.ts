import { Aurelia } from 'aurelia-framework';
import config from './config';
import 'fetch';
import 'bootstrap';

declare var System: any;
export function configure(aurelia: Aurelia) {

  let materialize = 'materialize-css'; // ONLY when using the "npm" option above
  return System.import(materialize).then(() => {
    aurelia.use
      .standardConfiguration()
      //.developmentLogging()
      // Install and configure the plugins
      .plugin('martingust/aurelia-repeat-strategies')
      .plugin('aurelia-materialize-bridge', bridge => bridge.useAll())
      .plugin('aurelia-animator-css')
      .plugin('aurelia-validation')
      .plugin('aurelia-auth', (baseConfig) => {
        baseConfig.configure(config);
      });
    return aurelia.start().then(a => a.setRoot());
  });
}
