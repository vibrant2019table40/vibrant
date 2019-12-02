'use strict';

process.env.DynamoDBRegion = 'us-east-1';
process.env.DynamoDBTable = 'vibrant-db';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var context;

describe('Tests app', function() {

  describe('get', () => {
    const event = {
      httpMethod: 'GET',
      pathParameters: {
        key: 'some'
      }
    };
    it('verifies successful response', async () => {
      const result = await app.lambdaHandler(event, context);

      expect(result).to.be.an('object');
      expect(result.statusCode).to.equal(200);
      expect(result.body).to.be.an('string');

      let response = JSON.parse(result.body);

      expect(response).to.be.an('object');
      expect(response).to.be;
      // expect(response.location).to.be.an("string");
    });
  });
});
