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

function entryCell(row, col) {
    let cellId = 'div-id_row_' + row + '_and_col_' + col;
    return document.getElementById(cellId);
}

function cellFieldList(className) {
    return document.getElementsByClassName(className);
}

describe('API basic tests', () => {
    test('create table and entry boxes without crashing', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });

    test('properly create cells', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
        for(let row = 1; row < 4; row++) {
            for(let col = 1; col < 4; col++) {
                expect(entryCell(row, col)).not.toBeUndefined();
            }
        }
    });

    test('properly create default input field within each cell', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
        let inputList = cellFieldList('cell-input');
        expect(inputList.length).toEqual(9);
    });

    test('properly create default dropdown field within each cell', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
        let dropdownList = cellFieldList('cell-dropdown');
        expect(dropdownList.length).toEqual(9);
    });

    test('properly create checkbox field within each cell', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'names': ['checkbox'],
            'types': [Boolean],
            'values': [false]
        });
        let checkboxList = cellFieldList('cell-checkbox');
        expect(checkboxList.length).toEqual(9);
    });
});

describe('Interaction tests', () => {
    test('User can input to cell', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });
});
