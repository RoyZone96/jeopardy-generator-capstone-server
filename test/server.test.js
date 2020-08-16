const knex = require('knex')
const app = require('../src/app');

describe('Jeopardy API:', function () {
  let db;
  let users = [
    { "title": "Buy Milk",   "completed": false },
    { "title": "Do Laundry",  "completed": true },
    { "title": "Vacuum", "completed": false },
    { "title": "Wash Windows",    "completed": true },
    { "title": "Make Bed", "completed": false }
  ]

  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE users RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE users RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 

  describe('GET /api/users', () => {

    beforeEach('insert some userss', () => {
      return db('users').insert(userss);
    })

    it('should respond to GET `/api/users` with an array of userss and status 200', function () {
      return supertest(app)
        .get('/api/users')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(userss.length);
          res.body.forEach((item) => {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'title', 'completed');
          });
        });
    });

  });

  
  describe('GET /api/users/:id', () => {

    beforeEach('insert some userss', () => {
      return db('users').insert(userss);
    })

    it('should return correct users when given an id', () => {
      let doc;
      return db('users')
        .first()
        .then(_doc => {
          doc = _doc
          return supertest(app)
            .get(`/api/users/${doc.id}`)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.include.keys('id', 'title', 'completed');
          expect(res.body.id).to.equal(doc.id);
          expect(res.body.title).to.equal(doc.title);
          expect(res.body.completed).to.equal(doc.completed);
        });
    });

    it('should respond with a 404 when given an invalid id', () => {
      return supertest(app)
        .get('/api/users/aaaaaaaaaaaa')
        .expect(404);
    });
    
  });

  
  describe('POST /api/users', function () {

    it('should create and return a new users when provided valid data', function () {
      const newItem = {
        'title': 'Do Dishes'
      };

      return supertest(app)
        .post('/api/users')
        .send(newItem)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'completed');
          expect(res.body.title).to.equal(newItem.title);
          expect(res.body.completed).to.be.false;
          expect(res.headers.location).to.equal(`/api/users/${res.body.id}`)
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badItem = {
        foobar: 'broken item'
      };
      return supertest(app)
        .post('/api/users')
        .send(badItem)
        .expect(400);
    });

  });

  
  describe('PATCH /api/users/:id', () => {

    beforeEach('insert some users', () => {
      return db('users').insert(userss);
    })

    it('should update item when given valid data and an id', function () {
      const item = {
        'title': 'Buy New Dishes'
      };
      
      let doc;
      return db('users')
        .first()
        .then(_doc => {
          doc = _doc
          return supertest(app)
            .patch(`/api/users/${doc.id}`)
            .send(item)
            .expect(200);
        })
        .then(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'completed');
          expect(res.body.title).to.equal(item.title);
          expect(res.body.completed).to.be.false;
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badItem = {
        foobar: 'broken item'
      };
      
      return db('users')
        .first()
        .then(doc => {
          return supertest(app)
            .patch(`/api/users/${doc.id}`)
            .send(badItem)
            .expect(400);
        })
    });

    it('should respond with a 404 for an invalid id', () => {
      const item = {
        'title': 'Buy New Dishes'
      };
      return supertest(app)
        .patch('/api/users/aaaaaaaaaaaaaaaaaaaaaaaa')
        .send(item)
        .expect(404);
    });

  });

  describe('DELETE /api/users/:id', () => {

    beforeEach('insert some userss', () => {
      return db('users').insert(userss);
    })

    it('should delete an item by id', () => {
      return db('users')
        .first()
        .then(doc => {
          return supertest(app)
            .delete(`/api/users/${doc.id}`)
            .expect(204);
        })
    });

    it('should respond with a 404 for an invalid id', function () {
      
      return supertest(app)
        .delete('/api/users/aaaaaaaaaaaaaaaaaaaaaaaa')
        .expect(404);
    });

  });

});
