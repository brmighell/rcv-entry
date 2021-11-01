const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
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

