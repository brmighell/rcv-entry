const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
  
  });

  describe('API basic tests', () => {
    test('hello world testing', () => {
      const config = {
        'id': 'div-id',
      };
      table.createDataTable(config);
      expect(document.getElementById(config.id).textContent).toEqual("Hello world");
    });
})