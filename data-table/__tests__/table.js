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

    test('check that getRows is properly 0-indexed', () => {
        expect(table.getNumRows('div-id')).toEqual(3);
    });

    test('check that getCols is properly 0-indexed', () => {
        expect(table.getNumColumns('div-id')).toEqual(3);
    });
});

describe('basic tests to ensure the buttons can function well', () => {
    beforeEach(() => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });

    /**
     * Runs a few assertions to make sure both the public functions and the actual table data
     * match the expected values
     * @param {int} numRows - the number of data rows (i.e. 0-indexed)
     * @param {int} numCols - the number of data columns (i.e. 0-indexed)
     * @returns {undefined}
     */
    function assertRowsColsEquals(numRows, numCols) {
        // First, check the public functions
        expect(table.getNumRows('div-id')).toEqual(numRows);
        expect(table.getNumColumns('div-id')).toEqual(numCols);

        // Note: add 1 to numRows and numCols to account for the headers
        let contents = document.getElementsByClassName("dt_cell");
        expect(contents.length).toEqual((numRows+1) * (numCols+1));
    }

    test('check the add column button fuctionality', () => {
        const button = document.getElementsByClassName("dt_left-panel-button")[0];
        assertRowsColsEquals(3, 3);
        button.click();
        assertRowsColsEquals(3, 4);
    });

    test('check the delete column button fuctionality', () => {
        const button = document.getElementsByClassName("dt_left-panel-button")[1];
        assertRowsColsEquals(3, 3);
        button.click();
        assertRowsColsEquals(3, 2);
    });

    test('check the add a row button fuctionality', () => {
        const button = document.getElementsByClassName("dt_left-panel-button")[2];
        assertRowsColsEquals(3, 3);
        button.click();
        assertRowsColsEquals(4, 3);
    });

    test('check the delete a row button fuctionality', () => {
        const button = document.getElementsByClassName("dt_left-panel-button")[3];
        assertRowsColsEquals(3, 3);
        button.click();
        assertRowsColsEquals(2, 3);
    });

    test('check that you can\'t delete all the rows', () => {
        const button = document.getElementsByClassName("dt_left-panel-button")[3];
        button.click();
        assertRowsColsEquals(2, 3);
        button.click();
        assertRowsColsEquals(1, 3);

        // Here, we get no change
        button.click();
        assertRowsColsEquals(1, 3);
    });

    test('check that you can\'t delete all the cols', () => {
        const button = document.getElementsByClassName("dt_left-panel-button")[1];
        button.click();
        assertRowsColsEquals(3, 2);
        button.click();
        assertRowsColsEquals(3, 1);

        // Here, we get no change
        button.click();
        assertRowsColsEquals(3, 1);
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
    return document.getElementsByClassName('dt_invalid-cell').length;
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
    /**
     * "Callback" function to check if a value is negative
     * @param {Number} value    - Value to be checked
     * @param {Number} row      - Row index that has changed (0-indexed: doen't include header)
     * @param {Number} col      - Column index that has changed (0-indexed: doen't include header)
     * @returns {string}        - 'Invalid' if less than zero, null otherwise
     */
    function invalidIfNegative(value, row, col) {
        expect(row).not.toBeLessThan(0);
        expect(col).not.toBeLessThan(0);
        if (value < 0) {
            return 'Invalid';
        }
        return null;
    }

    test('Invalid input to text input field updates cell appropriately', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])
        expect(numErrorsVisible()).toEqual(0);

        let input = document.getElementsByClassName('dt_cell-input')[0];
        input.value = -23;
        input.dispatchEvent(new Event('focusout'));

        expect(numErrorsVisible()).toEqual(1);
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

    test('Allow multiple error messages per cell, one per field', () => {
        createSingleCellTable(['Value0', 'Value1'], [Number, Number], [0, 0], [invalidIfNegative, invalidIfNegative])

        let input0 = document.getElementsByClassName('dt_cell-input')[0];
        let input1 = document.getElementsByClassName('dt_cell-input')[1];
        input0.value = -23;
        input0.dispatchEvent(new Event('focusout'));
        input1.value = -23;
        input1.dispatchEvent(new Event('focusout'));

        expect(document.getElementsByClassName('dt_error-message')).toHaveLength(2);
    });

    test('Regression test: only one error message per field', () => {
        createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])

        let input = document.getElementsByClassName('dt_cell-input')[0];
        input.value = -23;
        input.dispatchEvent(new Event('focusout'));
        input.dispatchEvent(new Event('focusout'));

        expect(document.getElementsByClassName('dt_error-message')).toHaveLength(1);
    });

    test('Callback has correctly 0-indexed row/col', () => {
        const mockCallback = jest.fn(() => null);
        createSingleCellTable(['Value'], [Number], [0], [mockCallback])

        let input = document.getElementsByClassName('dt_cell-input')[0];
        input.value = 23;
        input.dispatchEvent(new Event('focusout'));

        // The mock function is called once
        expect(mockCallback.mock.calls.length).toBe(1);

        // The first argument (the inputted value)
        expect(mockCallback.mock.calls[0][0]).toBe(23);

        // The second argument (the row)
        expect(mockCallback.mock.calls[0][1]).toBe(0);

        // The third argument (the col)
        expect(mockCallback.mock.calls[0][2]).toBe(0);
    });

    test('Ensure all buttons are non-submitting buttons', () => {
        createSingleCellTable();

        const elems = document.getElementsByTagName("button");
        for (const elem of elems) {
            expect(elem.type).toEqual("button");
        }
    });
});

describe('Test cell getters and setters', () => {
    beforeEach(() => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'canEditColumnHeader': false,
            'canEditRowHeader': false
        });
    });

    test('Can get simple data', () => {
        expect(table.getCellData('div-id', 0, 0)).toEqual({'Value': NaN, 'Status': 'Active'});
    });
    test('Row too high throws error', () => {
        expect(() => table.getCellData('div-id', 3, 0)).toThrow();
    });
    test('Last row does not throw error', () => {
        expect(() => table.getCellData('div-id', 2, 0)).not.toThrow();
    });
    test('Col too high throws error', () => {
        expect(() => table.getCellData('div-id', 0, 3)).toThrow();
    });
    test('Row too low throws error', () => {
        expect(() => table.getCellData('div-id', -1, 0)).toThrow();
    });
    test('Can set and clear an error message', () => {
        table.setCellErrorMessage('div-id', 0, 0, 0, "test error");
        expect(numErrorsVisible()).toEqual(1);

        table.clearCellErrorMessage('div-id', 0, 0, 0);
        expect(numErrorsVisible()).toEqual(0);
    });
    test('Can set multiple error message', () => {
        table.setCellErrorMessage('div-id', 0, 0, 0, "test error");
        table.setCellErrorMessage('div-id', 1, 0, 0, "test error");
        expect(numErrorsVisible()).toEqual(2);
    });
    test('Can disable a field', () => {
        const tags = document.getElementsByTagName('input');
        expect(tags).toHaveLength(9); // one for each row and col; not the column header
        const tag = tags[0];

        // False to start with
        expect(tag.disabled).toBeFalsy();

        // Then disable it
        table.disableField('div-id', 0, 0, 0);
        expect(tag.disabled).toBeTruthy();

        // And re-enable
        table.enableField('div-id', 0, 0, 0);
        expect(tag.disabled).toBeFalsy();
    });
    test('Disabled fields return null, not the inputted value', () => {
        const input = document.getElementsByTagName('input')[0];
        input.value = 23;
        input.dispatchEvent(new Event('focusout'));

        // Returns 23 when enabled
        expect(table.getCellData('div-id', 0, 0).Value).toEqual(23);

        // Then disable it
        table.disableField('div-id', 0, 0, 0);

        // Now it returns null
        expect(table.getCellData('div-id', 0, 0).Value).toBeNull();
    });
    test('Disabling a field clears any errors', () => {
        // Set the error
        table.setCellErrorMessage('div-id', 0, 0, 0, "err");
        expect(numErrorsVisible()).toEqual(1);

        // Disable the field
        table.disableField('div-id', 0, 0, 0);

        // Which clears the error
        expect(numErrorsVisible()).toEqual(0);
    });
});

describe('Serialization', () => {
    beforeEach(() => {
        table.createDataTable({
            'wrapperDivId': 'div-id',
            'numRows': 1,
            'numColumns': 1
        });
    });

    test('Default serialization', () => {
        expect(table.toJSON('div-id')).toEqual(JSON.stringify({
            "version":1,
            "rowNames": [""],
            "columnNames": [],
            "data": [[{"Value":null,"Status":"Active"}]]
        }));
    });

    test('Serialization of comma-separated number', () => {
        cell0 = document.getElementById('div-id_row_1_and_col_1_and_field_0_')
        cell0.value = '1,000'
        cell0.dispatchEvent(new Event('focusout'));
        expect(table.toJSON('div-id')).toEqual(JSON.stringify({
            "version":1,
            "rowNames": [""],
            "columnNames": [],
            "data": [[{"Value":1000,"Status":"Active"}]]
        }));
    });
});
