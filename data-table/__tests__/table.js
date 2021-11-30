const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
});

describe('basic tests to ensure createDataTable can function well', () => {
    beforeEach(() => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });

    test('check the add column button', () => {
        const config = {
            'wrapperDivId': 'div-id',
        };
        table.createDataTable(config);
        const contents = document.getElementById(config.wrapperDivId).textContent;
        expect(contents.substr(0, 12)).toEqual("+ Add column");
    });

    test('check the default value of rows', () => {
        const numRows = document.getElementsByTagName('table')[0].rows.length;
        expect(numRows).toEqual(4);
    });

    test('check the default value of columns', () => {
        const numCols = document.getElementsByTagName('table')[0].rows[0].cells.length;
        expect(numCols).toEqual(4);
    });

    test('properly test the first cell', () => {
        const contents = document.getElementsByClassName('dt_cell')[0].textContent;
        expect(contents).toEqual('Rows');
    });

    test('properly test the first cell', () => {
        const contents = document.getElementsByClassName('dt_cell')[1].textContent;
        expect(contents).toEqual('Column 1');
    });

    test('check that subDivs are created', () => {
        expect(document.getElementsByClassName("SubDiv")).not.toEqual(null);
    });

    test('check that data-table element is created', () => {
        expect(document.getElementsByClassName("data-table")).not.toEqual(null);
    });
});

describe('basic tests to ensure the buttons can function well', () => {
    beforeEach(() => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });

    test('check the add column button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        const addButton = document.getElementsByClassName("dt_left-panel-button");
        let contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * numCols);
        addButton[0].click();
        contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * (numCols + 1));
    });

    test('check the delete column button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        const addButton = document.getElementsByClassName("dt_left-panel-button");
        let contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * numCols);
        addButton[1].click();
        contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * (numCols - 1));
    });

    test('check the add a row button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        const addButton = document.getElementsByClassName("dt_left-panel-button");
        let contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * numCols);
        addButton[2].click();
        contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual((numRows+1) * numCols);
    });

    test('check the delete a row button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        const addButton = document.getElementsByClassName("dt_left-panel-button");
        let contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * numCols);
        addButton[3].click();
        contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual(numRows * (numCols-1));
    });
});

describe('ensure row and columns can be independently set to editable', () => {
    function childInColHeaderCell(col) {
        const cell = document.getElementById(`_theadId_div-id__row_0_and_col_${col}_`);
        if (cell == null) {
            return null;
        }
        return cell.children[0];
    }
    function childInRowHeaderCell(row) {
        const cell = document.getElementById(`div-id_row_${row}_and_col_0_`);
        if (cell == null) {
            return null;
        }
        return cell.children[0];
    }
    test('Ensure inputs exist on both row and col', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'canEditRowHeader': true,
            'canEditColumnHeader': true
        });

        expect(childInRowHeaderCell(1).tagName).toEqual('INPUT');
        expect(childInColHeaderCell(1).tagName).toEqual('INPUT');
    });
    test('Ensure inputs exist on only row', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'canEditRowHeader': true,
            'canEditColumnHeader': false
        });

        expect(childInRowHeaderCell(1).tagName).toEqual('INPUT');
        expect(childInColHeaderCell(1)).toEqual(undefined);
    });
    test('Ensure inputs exist on only col', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'canEditRowHeader': false,
            'canEditColumnHeader': true
        });

        expect(childInRowHeaderCell(1)).toEqual(undefined);
        expect(childInColHeaderCell(1).tagName).toEqual('INPUT');
    });
    test('Ensure defaults are row only', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });

        expect(childInRowHeaderCell(1).tagName).toEqual('INPUT');
        expect(childInColHeaderCell(1)).toEqual(undefined);
    });
    test('Ensure add col also adds an input', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'canEditRowHeader': true,
            'canEditColumnHeader': true
        });

        const leftButtons = document.getElementsByClassName("dt_left-panel-button");
        const addColButton = leftButtons[0];

        // Doesn't exist before button click
        expect(childInColHeaderCell(4)).toEqual(null);

        // Does exist after
        addColButton.click();
        expect(childInColHeaderCell(4).tagName).toEqual('INPUT');
    });
    test('Ensure add row also adds an input', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'canEditRowHeader': true,
            'canEditColumnHeader': true
        });

        const leftButtons = document.getElementsByClassName("dt_left-panel-button");
        const addColButton = leftButtons[2];

        // Doesn't exist before button click
        expect(childInRowHeaderCell(4)).toEqual(null);

        // Does exist after
        addColButton.click();
        expect(childInRowHeaderCell(4).tagName).toEqual('INPUT');
    });
});

describe('wrapperDivId config', () => {
    test('Passing invalid div', () => {
        expect(() => {
            table.createDataTable({
            'wrapperDivId': 'not-div-id',
        });
    }).toThrow();
});

    test('Missing parameter: div id', () => {
        expect(() => {
            table.createDataTable({
                'numRows': 3
            });
        }).toThrow();
    });
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
    return null;
}

describe('API basic tests', () => {
    beforeEach(() => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });

    test('create table and entry boxes without crashing', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });

    test('properly create cells', () => {
        for(let row = 1; row < 4; row++) {
            for(let col = 1; col < 4; col++) {
                expect(entryCell(row, col)).not.toBeUndefined();
            }
        }
    });

    test('properly create default input field within each cell', () => {
        let inputList = cellFieldList('dt_cell-input');
        expect(inputList.length).toEqual(9);
    });

    test('properly create default dropdown field within each cell', () => {
        let dropdownList = cellFieldList('dt_cell-dropdown');
        expect(dropdownList.length).toEqual(9);
    });

    test('properly create checkbox field within each cell', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'names': ['checkbox'],
            'types': [Boolean],
            'values': [false]
        });
        let checkboxList = cellFieldList('dt_cell-checkbox');
        expect(checkboxList.length).toEqual(9);
    });

    test('properly create checkbox field within each cell', () => {
        let dropdownList = cellFieldList('dt_cell-dropdown');
        for (let i = 0; i < 9; i++) {
            let res = dropdownList[i].options[0].text;
            expect(res).toBe("Active");
        }
    });

    test('properly test how many options for the dropdown filed', () => {
        let dropdownList = cellFieldList('dt_cell-dropdown');
        for (let i = 0; i < 9; i++) {
            let res = dropdownList[i].options.length;
            expect(res).toBe(2);
        }
    });

    test('properly create checkbox field within each cell', () => {
        let inputList = cellFieldList('dt_cell-input');
        expect(inputList[0].getAttribute("placeholder")).toEqual("0");
    });

    test('check that an error is thrown if config has no columns', () => {
        expect(() => {
            table.createDataTable({
                'wrapperDivId': 'a',
                'numColumns': 0
            });
        }).toThrow("The table must have at least one column and one row!");
    });

    test('check that an error is thrown if config has no rows', () => {
        expect(() => {
            table.createDataTable({
                'wrapperDivId': 'a',
                'numRows': 0
            });
        }).toThrow("The table must have at least one column and one row!");
    });

    test('check that an error is thrown if config has no fields for the cells', () => {
        expect(() => {
            table.createDataTable({
                'wrapperDivId': 'a',
                'names': []
            });
        }).toThrow("Each cell must have at least one entry field.");
    });

    test('check that an error is thrown if config has no types for the cell fields', () => {
        expect(() => {
            table.createDataTable({
                'wrapperDivId': 'a',
                'names': ["Placeholder"],
                'types': []
            });
        }).toThrow("Each entry field must have a type associated with it.");
    });

    test('check that an error is thrown if one of the field types is not supported', () => {
        expect(() => {
            table.createDataTable({
                'wrapperDivId': 'a',
                'names': ["Placeholder"],
                'types': [String]
            });
        }).toThrow("Each entry field must be one of the following types: Boolean, Number, or Array");
    });
});

describe('Interaction tests', () => {
    test('Invalid input to text input field updates cell appropriately', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])
        expect(numErrorsVisible()).toEqual(0);

        let input = document.getElementsByClassName('dt_cell-input')[0];
        input.value = -23;
        input.dispatchEvent(new Event('focusout'));

        expect(document.getElementsByClassName('dt_invalid-cell').length).toEqual(1);
    });

    test('Valid input to text input field updates cell appropriately', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])

        let input = document.getElementsByClassName('dt_cell-input')[0];
        input.value = -23;
        input.dispatchEvent(new Event('focusout'));
        input.value = 23;
        input.dispatchEvent(new Event('focusout'));

        expect(numErrorsVisible()).toEqual(0);
    });

    test('Ensure all buttons are non-submitting buttons', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])

        const elems = document.getElementsByTagName("button");
        for (const elem of elems) {
            expect(elem.type).toEqual("button");
        }
    });
});
