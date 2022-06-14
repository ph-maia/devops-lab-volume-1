const assert = require('assert');
const request = require('supertest');
const moxios = require('moxios');

describe('App Integration Test', () => {
    let app;
    let requestUrl;

    beforeEach(() => {
        console.error = () => {};
        app = require('../src/app');
        requestUrl = `${app.get('API_URL')}/api/welcome`;
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('Should return a page title message', async () => {
        // Arrange
        moxios.stubRequest(requestUrl, {
            status: 200,
            response: {
                message: 'Aplicação - DevOps Marcianos!'
            }
        });

        const client = request(app);

        // Act
        const response = await client.get('/');

        // Assert
        assert.equal(response.status, 200);
        assert.ok(response.text.includes('color: blue'));
        assert.ok(response.text.includes('<h1>Aplicação - DevOps Marcianos!</h1>'));
        // assert.ok(response.text.includes('<p>Seja redirecionado ao <a href="https://www.youtube.com/watch?v=MTbF9ALViJw&ab_channel=LucasFernando">Marcianos</a></p>'));
    });

    it('Should return npm a page with an error in title message', async () => {
        // Arrange
        moxios.stubRequest(requestUrl, {
            status: 500
        });

        const client = request(app);

        // Act
        const response = await client.get('/');

        // Assert
        assert.equal(response.status, 200);
        assert.ok(response.text.includes('color: blue'));
        assert.ok(response.text.match(/<h1>Ocorreu um erro: .*<\/h1>/));
    });
});
