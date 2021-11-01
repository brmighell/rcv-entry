// test 4-5 function
const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
});

describe('test createDataTable', () => {
    
// test 4-5 function

    
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

// function validateConfig(config) {

//   if (config.numColumns <= 0 || config.numRows <= 0) {
//       throw new Error("The table must have at least one column and one row!")
//   }

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

// /**
// * @property {object} names     - Array of the names for all fields in a cell | Default: ["Value"]
// * @property {object} types     - Array of the types for all fields in a cell | Default: [Number]
// * @property {object} defaults  - Array of the defaults for all fields in a cell | Default: [0]
// * @property {object} callbacks - Tells what function to execute when a field is changed | Default: ["None"]
// */
// this.datumConfig = {
//   names: clientConfig.names === undefined ? ["Value"] : clientConfig.names,
//   types: clientConfig.types === undefined ? [Number] : clientConfig.types,
//   values: clientConfig.values === undefined ? [0] : clientConfig.values,
//   callbacks: clientConfig.callbacks === undefined ? ["None"] : clientConfig.callbacks
// }

