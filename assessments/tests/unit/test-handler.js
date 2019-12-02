'use strict';

const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var context;

describe('Tests app', function () {
    describe('get', () => {
        const event = {
            pathParameters: {
                key: 'some'
            }
        };
        it('verifies successful response', async () => {
            const result = await app.lambdaHandler(event, context)

            expect(result).to.be.an('object');
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('string');

            let response = JSON.parse(result.body);

            expect(response).to.be.an('object');
            expect(response).to.deep.equal({ Data: 'data', CallerKey: 'some' });
            // expect(response.location).to.be.an("string");
        });
    });
});
