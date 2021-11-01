// test 4-5 function
const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
});

describe('test createDataTable', () => {
      
  test('test0', () => {
    const config = {
        'wrapperDivId': 'div-id',
    };
    table.createDataTable(config);
    const contents = document.getElementById(config.wrapperDivId).textContent;
    expect(contents.substr(0, 10)).toEqual("Add column");
  });

  test('test1', () => {
      const config = {
          'wrapperDivId': 'div-id',
      };
      table.createDataTable(config);
      let resConfigDict = table.configDict;
      let resConfig = resConfigDict[config.wrapperDivId];
      expect(resConfig.numRows).toEqual(3);
      expect(resConfig.numColumns).toEqual(4);
      expect(resConfig.rowsName).toEqual("row");
      expect(resConfig.columnsName).toEqual("column");
  });

  test('test2', () => {
    const config = {
        'wrapperDivId': 'div-id',
    };
    table.createDataTable(config);
    let resConfigDict = table.configDict;
    let resConfig = resConfigDict[config.wrapperDivId];
    let resTableIds = resConfig.tableIds;
    expect(resTableIds.wrapperDivId).toEqual(config.wrapperDivId);
    expect(resTableIds.tableDivId).toEqual('_tableDivId_' + config.wrapperDivId);
    expect(resTableIds.entryBoxDivId).toEqual('_entryBoxDivId_' + config.wrapperDivId);
    expect(resTableIds.tableElementId).toEqual('_tableId_' + config.wrapperDivId);
    expect(resTableIds.theadElementId).toEqual('_theadId_' + config.wrapperDivId);
    expect(resTableIds.tbodyElementId).toEqual('_tbodyId_' + config.wrapperDivId);
  });

});

describe('test vaidate', () => {
  test('test throw error', () => {
    const config = {
      'wrapperDivId': 'div-id',
    };
    try {
      table.validateConfig(config);
    } catch (err) {
      expect(err).toEqual("The table must have at least one column and one row!");
    }
  });
});

