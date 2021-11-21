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

function numErrorsVisible() {
    return document.getElementsByClassName('invalid-cell').length;
}

function createSingleCellTable(names, types, values, callbacks) {
    table.createDataTable({
        'wrapperDivId': 'div-id',
        'numColumns': 1,
        'numRows': 1,
        names,
        types,
        values,
        callbacks
    });
}

function invalidIfNegative(value) {
    if (value[0] < 0) {
        return 'Invalid';
    }
    return 'Okay';
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

    test('check that an error is thrown if config has no columns', () => {
        expect(() => {
            table.validateConfig({
                'numColumns': 0
            });
        }).toThrow("The table must have at least one column and one row!");
    });

    test('check that an error is thrown if config has no rows', () => {
        expect(() => {
            table.validateConfig({
                'numRows': 0
            });
        }).toThrow("The table must have at least one column and one row!");
    });

    test('check that an error is thrown if config has no fields for the cells', () => {
        expect(() => {
            table.validateConfig({
                'datumConfig': {
                    'names': []
                }
            });
        }).toThrow("Each cell must have at least one entry field.");
    });

    test('check that an error is thrown if config has no types for the cell fields', () => {
        expect(() => {
            table.validateConfig({
                'datumConfig': {
                    'names': ["Placeholder"],
                    'types': []
                }
            });
        }).toThrow("Each entry field must have a type associated with it.");
    });

    test('check that an error is thrown if one of the field types is not supported', () => {
        expect(() => {
            table.validateConfig({
                'datumConfig': {
                    'names': ["Placeholder"],
                    'types': [String]
                }
            });
        }).toThrow("Each entry field must be one of the following types: Boolean, Number, or Array");
    });
});

describe('Interaction tests', () => {
    test('Invalid input to text input field updates cell appropriately', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])
        expect(numErrorsVisible()).toEqual(0);

        let input = document.getElementsByClassName('cell-input')[0];
        input.value = -23;
        input.dispatchEvent(new Event('focusout'));

        expect(document.getElementsByClassName('invalid-cell').length).toEqual(1);
    });

    test('Valid input to text input field updates cell appropriately', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])

        let input = document.getElementsByClassName('cell-input')[0];
        input.value = -23;
        input.dispatchEvent(new Event('focusout'));
        input.value = 23;
        input.dispatchEvent(new Event('focusout'));

        expect(numErrorsVisible()).toEqual(0);
    });
});

