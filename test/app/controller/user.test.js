const {app, mock, assert } = require('egg-mock/bootstrap');

let jwt;

describe('test/app/controller/user.test.js', () => {
  it('should GET /user , and respond with json', async () => {
    return await app.httpRequest()
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('should GET /user/:id , and respond with json', async () => {
    const result = await app.httpRequest()
                    .get('/user/6051913743de9237940032ae')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200); 

    return result;
  });

  it('should GET /user/:wrong id , and respond 404', async () => {
    const result = await app.httpRequest()
                    .get('/user/6051913743de9237940032a2')
                    .expect(404); 

    return result;
  });

  it('should GET /user/:wrong id , and respond 500', async () => {
    const result = await app.httpRequest()
                    .get('/user/6051913743de92379400')
                    .expect(500); 

    return result;
  });
  
  it('post less than requirement and respond 422', async () => {
    return await app.httpRequest()
      .post('/user')
      .send({
          name: '只写用户名不写密码',
        })
      .expect(422);
  });

  it('should POST /user/login, post right name and password, and respond 200', 
    async () => {
    const result = await app.httpRequest()
                    .post('/user/login')
                    .send({
                      name: '单元测试用户1',
                      password: 'tiyjkjhkg'
                    })
                    .expect('Content-Type', /json/)
                    .expect(200); 

    let tmp = result.text.toString();
    jwt = tmp.slice(10, tmp.length-2);              

    return result;
  });

  it('should POST /user/login, post wrong name or password, and respond 401', 
    async () => {
    const result = await app.httpRequest()
                    .post('/user/login')
                    .send({
                      name: '单元测试用户',
                      password: 'tiyjkjhkg'
                    })
                    .expect(401);    

    return result;
  });

  it('should PATCH /user/:id, patch json data', async () => {
    return await app.httpRequest()
      .patch('/user/605f5384876e08157cba4618')
      .set('Authorization', `Bearer ${jwt}`)
      .send(
        {
          "gender": "male",
          "headline": "改一改",
          "employments": [
              {"company": "厂"},
              {"job": "码农"}
          ],
          "locations": ["上海", "杭州"],
          "educations": [
              { "school": "普通大学" },
              { "major": "计算机" },
              { "diploma": 3 }
          ]
        }
      )
      .expect('Content-Type', /json/)
      .expect(200);
  });

  it('should GET /user/:id/following', async () => {
    return await app.httpRequest()
      .get('/user/605f5384876e08157cba4618/following')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  
  // it('should PUT /user/following/:id', async () => {
  //   return await app.httpRequest()
  //     .put('/user/following/605732675d24672c78912a04')
  //     .set('Authorization', `Bearer ${jwt}`)
  //     .expect(204);
  // });
});