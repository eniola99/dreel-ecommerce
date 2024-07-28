import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import product from './product';
import banner from './banner';
import accessories from './accessories';
import account from './account';
import announcement from './announcement';
import imeiCategories from './imeiCategories';
import unlockRequest from './unlockRequest';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    product,
    banner,
    accessories,
    account,
    announcement,
    imeiCategories,
    unlockRequest,
  ]),
});
