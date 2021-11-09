const table = require('../table.js');

beforeEach(() => {
    document.body.innerHTML = '<div id="div-id"></div>'
});

describe('basic tests to ensure createDataTable can function well', () => {
    beforeEach(() => {
        config = {
            'wrapperDivId': 'div-id',
        };
        table.createDataTable(config);
    });

    test('check the add column button name', () => {
        const contents = document.getElementById(config.wrapperDivId).textContent;
        expect(contents.substr(0, 12)).toEqual("+ Add column");
    });

    test('check the default value of rows', () => {
        const contents = document.getElementsByTagName('table')[0].rows.length;
        expect(contents).toEqual(4);
    });

    test('check the default value of columns', () => {
        const contents = document.getElementsByTagName('table')[0].rows[0].cells.length;
        expect(contents).toEqual(4);
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

    test('check the add column button fuctionality', () => {
        const addButton = document.getElementsByClassName("add-row-button");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(16);
        addButton[0].click();
        contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(20);
    });

    test('check the delete column button fuctionality', () => {
        const addButton = document.getElementsByClassName("add-row-button");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(16);
        addButton[1].click();
        contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(12);
    });

    test('check the add a row button fuctionality', () => {
        const addButton = document.getElementsByClassName("add-row-button");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(16);
        addButton[2].click();
        contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(20);
    });

    test('check the delete a row button fuctionality', () => {
        const addButton = document.getElementsByClassName("add-row-button");
        let contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(16);
        addButton[3].click();
        contents = document.getElementsByClassName("data-table-cell");
        expect(contents.length).toEqual(12);
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

describe('API basic tests', () => {
    beforeEach(() => {
        config = {
            'wrapperDivId': 'div-id',
        };
        table.createDataTable(config);
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

    test('properly create checkbox field within each cell', () => {
        let dropdownList = cellFieldList('cell-dropdown');
        for (let i = 0; i < 9; i++) {
            let res = dropdownList[i].options[1].text;
            expect(res).toBe("Inactive");
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
                }
            });
        }).toThrow("Each entry field must be one of the following types: Boolean, Number, or Array");
    });
});

describe('Interaction tests', () => {
    test('User can input to cell', () => {
        table.createDataTable({
            'wrapperDivId': 'div-id'
        });
    });
});
