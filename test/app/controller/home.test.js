'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {
   it('should GET /', async () => {
      const result = await app.httpRequest()
                       .get('/')
                       .expect('hi, egg')
                       .expect(200);

      // console.log(result.text);
      return result;
  });
});
