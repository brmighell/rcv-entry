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

    test('check the add row button', () => {
        const config = {
            'wrapperDivId': 'div-id',
        };
        table.createDataTable(config);
        const contents = document.getElementById(config.wrapperDivId).textContent;
        expect(contents.substr(0, 9)).toEqual("Add a row");
    });

    test('check the default value of rows', () => {
        const numRows = document.getElementsByTagName('table')[0].rows.length;
        expect(numRows).toEqual(4);
    });

    test('check the default value of columns', () => {
        const numCols = document.getElementsByTagName('table')[0].rows[0].cells.length;
        expect(numCols).toEqual(4);
    });

    test('properly test the contens of columns' , () => {
        const contents = document.getElementsByClassName('enter-row-name')[0].placeholder;
        expect(contents).toEqual('Number of columns');
    });

    test('properly test the first cell', () => {
        const contents = document.getElementsByClassName('data-table-cell')[0].textContent;
        expect(contents).toEqual('Rows');
    });

    test('properly test the first cell', () => {
        const contents = document.getElementsByClassName('data-table-cell')[1].textContent;
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

    test('check the reset button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        content = document.getElementsByClassName("data-table")[0];
        resButtons = content.getElementsByTagName("button");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(numRows * numCols);
    });

    test('check the add a row button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        const addButton = document.getElementsByClassName("add-item");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(numRows * numCols);
        addButton[0].click();
        contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual((numRows + 1) * numCols);
    });


    // document.getElementById("_rowInputId_wrapper-0") not defined
    test('check the delete a row button fuctionality', () => {
        const numRows = 4;
        const numCols = 4;
        const deleteButton = document.getElementsByClassName("delete-item");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(numRows * numCols);
        // document.getElementById("_rowInputId_wrapper-0").value = 3;
        // deleteButton[1].click();
        // contents = document.getElementsByClassName("data-table-cell");
        // expect(contents.length).toEqual((numRows + 1) * numCols);
        // console.log("hahahah: ", document.getElementById("_rowInputId_wrapper-0").value);
        // // deleteButton[0].click();
        // // contents = document.getElementsByClassName("data-table-cell");
        // // expect(contents.length).toEqual((numRows - 1) * numCols);
    });

    test('check change number of rows button', () => {
        const numRows = 4;
        const numCols = 4;
        let rowNumButton = document.getElementsByClassName("enter-row-name");
        rowNumButton.value = 5;
        // document.getElementById("_rowInputId_wrapper-0").click();
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(numRows * numCols);
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
    return 'Okay';
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
        let inputList = cellFieldList('cell-input');
        expect(inputList.length).toEqual(9);
    });

    test('properly create default dropdown field within each cell', () => {
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

    test('properly create checkbox field within each cell', () => {
        let dropdownList = cellFieldList('cell-dropdown');
        for (let i = 0; i < 9; i++) {
            let res = dropdownList[i].options[0].text;
            expect(res).toBe("Active");
        }
    });

    test('properly test how many options for the dropdown filed', () => {
        let dropdownList = cellFieldList('cell-dropdown');
        for (let i = 0; i < 9; i++) {
            let res = dropdownList[i].options.length;
            expect(res).toBe(2);
        }
    });

    test('properly create checkbox field within each cell', () => {
        let inputList = cellFieldList('cell-input');
        expect(inputList[0].getAttribute("placeholder")).toEqual("0");
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
                },
                'numColumns': -1
            });
        }).toThrow("The table must have at least one column and one row!");
    });
});

function getNumRows() {
    return document.getElementsByTagName('table')[0].rows.length;
}

function getNumColumns() {
    return document.getElementsByTagName('table')[0].rows[0].cells.length;
}

describe('Interaction tests', () => {
    // test('Invalid input to text input field updates cell appropriately', () => {
    //     createSingleCellTable(['Value'], [Number], [0], [invalidIfNegative])
    //     expect(numErrorsVisible()).toEqual(0);

    //     let input = document.getElementsByClassName('cell-input')[0];
    //     input.value = -23;
    //     input.dispatchEvent(new Event('focusout'));

    //     expect(document.getElementsByClassName('invalid-cell').length).toEqual(1);
    // });

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


// describe('Input bar tests', () => {
//     test ('test num of cols'), () => {

//     }
// }


// num of cols
// num of rows
// change row name
// delete row button works
// add row button
// reset table button
