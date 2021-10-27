const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
  });

  describe('API basic tests', () => {
    test('hello world testing', () => {
      const config = {
        'wrapperDivId': 'div-id',
      };
      table.createDataTable(config);
      const contents = document.getElementById(config.wrapperDivId).textContent;
      expect(contents.substr(0, 10)).toEqual("Add column");
    });
})
