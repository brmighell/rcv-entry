/**
 * Global vars - storing data for callbacks
 */
/* Collection of eventTypes
* TODO: Figure out why lint doesn't like ENUMs */
// enum eventTypes = {};

// Initialization of config dictionary; stores in the form {wrapperDivId : config}
let configDict = {};

/**
 * Config object for each datatable. Expects clientConfig.wrapperDivId to exist.
 */
class Config {
    /**
     * Global variable containing configuration information for the table
     * @param {object} clientConfig     - Configuration information passed in by the client
     * @property {string} wrapperDivId  - ID for the wrapper
     * @property {number} numRows       - Number of rows in the table
     * @property {number} numColumns    - Number of columns in the table
     * @property {string} rowsName      - Name of rows in the table
     * @property {string} columnsName   - Name of columns in the table
     * @property {object} tableIds      - Container for all the table's magic strings
     * @property {object} datumConfig   - Container for default values of a cell
     */
    constructor(clientConfig) {
        this.defaultNumRows = clientConfig.numRows === undefined ? 3 : clientConfig.numRows;
        this.defaultNumColumns = clientConfig.numColumns === undefined ? 3 : clientConfig.numColumns;
        this.rowsName = clientConfig.rowsName === undefined ? "Row" : clientConfig.rowsName;
        this.columnsName = clientConfig.columnsName === undefined ? "Column" : clientConfig.columnsName;
        /**
         * TODO: Need to add some sort of check to account for when this pluralization doesn't work
         */
        this.rowsNamePlural = this.rowsName + "s";
        this.columnsNamePlural = this.columnsName + "s";
        this.wrapperDivId = clientConfig.wrapperDivId;

        /**
         * @property {string} tableDivId        - ID for the div containing the table
         * @property {string} entryBoxDivId     - ID for the div containing the entry box
         * @property {string} tableElementId    - Id for the entire table element
         * @property {string} theadElementId    - ID for the table's first row (column headers) element
         * @property {string} tbodyElementId    - ID for the table's body element
         */
        this.tableIds = {
            tableDivId: '_tableDivId_' + clientConfig.wrapperDivId + '_',
            tableElementId: '_tableId_' + clientConfig.wrapperDivId + '_',
            theadElementId: '_theadId_' + clientConfig.wrapperDivId + '_',
            tbodyElementId: '_tbodyId_' + clientConfig.wrapperDivId + '_'
        }

        this.entryIds = {
            entryBoxDivId: '_entryBoxDivId_' + clientConfig.wrapperDivId + '_',
            colInputId: '_colInputId_' + clientConfig.wrapperDivId + '_',
            rowInputId: '_rowInputId_' + clientConfig.wrapperDivId + '_'
        }

        /**
         * @property {object} names     - Array of the names for all fields in a cell | Default: ["Value"]
         * @property {object} types     - Array of the types for all fields in a cell | Default: [Number]
         * @property {object} defaults  - Array of the defaults for all fields in a cell | Default: [0]
         * @property {object} callbacks - Tells what function to execute when a field is changed | Default: ["None"]
         */
        this.datumConfig = {
            names: clientConfig.names === undefined ? ["Value", "Status"] : clientConfig.names,
            types: clientConfig.types === undefined ? [Number, Array] : clientConfig.types,
            values: clientConfig.values === undefined ? [0, ["Active", "Inactive"]] : clientConfig.values,
            callbacks: clientConfig.callbacks === undefined ? [invalidIfNegative, null] : clientConfig.callbacks
        }

        /**
         * Below is not actual config data - just cached data
         * Note: both of these include the header rows
         */
        this.currNumRows = 0;
        this.currNumColumns = 0;
    }
}

/**
 * FIXME: Remove this when done!
 * Test functions for callback functionality
 */
/**
 * "Callback" function to check if a value is negative
 * @param {Number} value    - Value to be checked
 * @returns {string}        - 'Invalid' if less than zero, 'Okay' otherwise
 */
function invalidIfNegative(value) {
    if (value < 0) {
        return 'Invalid';
    }
    return 'Okay';
}

/**
 * Functions for table creation
 */

/**
 * If any option is not provided, chooses a sane default
 * @param {object} clientConfig - A set of overriding config values, edits in-place
 * @returns {undefined}         - Doesn't return anything
 * @throws Error                - If any required option is not provided
 */
function setConfig(clientConfig) {
    let config = new Config(clientConfig);

    validateConfig(config);

    configDict[clientConfig.wrapperDivId] = config;
}

/**
 * Performs basic logic-checking on the config after defaults have been set
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 * @throws Error            - If any option is provided incorrectly
 */
function validateConfig(config) {
    if (config.wrapperDivId === undefined) {
        throw new Error("An ID for the wrapper div is required");
    }

    if (config.defaultNumColumns <= 0 || config.defaultNumRows <= 0) {
        throw new Error("The table must have at least one column and one row!");
    }

    if (config.datumConfig.names.length <= 0) {
        throw new Error("Each cell must have at least one entry field.");
    }

    if (config.datumConfig.types.length <= 0) {
        throw new Error("Each entry field must have a type associated with it.")
    }

    /**
     * FIXME: allowedTypes should be relocated somewhere else if we wind up keeping it
     */
    let allowedTypes = [Boolean, Number, Array];

    for (const element of config.datumConfig.types) {
        if (!allowedTypes.includes(element)) {
            throw new Error("Each entry field must be one of the following types: Boolean, Number, or Array");
        }
    }
}

/**
 * Creates two sub divs and inserts them into the wrapper div
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createSubDivs(config) {
    let subDivClass = "SubDiv";

    let entryBoxDiv = document.createElement("div");
    entryBoxDiv.id = config.entryIds.entryBoxDivId;
    entryBoxDiv.classList.add(subDivClass);

    let tableDiv = document.createElement("div");
    tableDiv.id = config.tableIds.tableDivId;
    tableDiv.classList.add(subDivClass);

    document.getElementById(config.wrapperDivId).appendChild(entryBoxDiv);
    document.getElementById(config.wrapperDivId).appendChild(tableDiv);
}

/**
 * Creates an HTML table and assigns unique element IDs to all parts of the table.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createTable(config) {
    let table = document.createElement("table");
    table.id = config.tableIds.tableElementId;
    table.classList.add("data-table");

    let thead = document.createElement("thead");
    thead.id = config.tableIds.theadElementId;

    let tbody = document.createElement("tbody");
    tbody.id = config.tableIds.tbodyElementId;

    table.appendChild(thead);
    table.appendChild(tbody);
    let tableDiv = document.getElementById(config.tableIds.tableDivId);
    tableDiv.appendChild(table);
    document.getElementById(config.wrapperDivId).appendChild(tableDiv)

    createColumnHeader(config);

    for (let row = 1; row < config.defaultNumRows + 1; row++) {
        addSingleRow(config);
    }
}

function createColumnHeader(config) {
    // Insert a row into the body of the table
    let row = document.getElementById(config.tableIds.theadElementId).insertRow(0);
    // Then for each column
    for (let colIndex = 0; colIndex < config.defaultNumColumns + 1; colIndex++) {
        // Create an entry cell
        let cell = row.insertCell(colIndex);
        cell.id = cellIndexToElementId(config.tableIds.theadElementId, 0, colIndex)
        cell.classList.add("data-table-cell");

        let cellText = colIndex === 0 ? config.rowsNamePlural : config.columnsName + " " + colIndex;
        cell.appendChild(document.createTextNode(cellText));
    }

    config.currNumColumns = config.defaultNumColumns + 1;
    config.currNumRows = 1;
}

/**
 * Adds a single column to the table
 * @param {object} config     - Table configuration object
 * @param {String} [content]  - Content to place in the top cell of a column (uses default if
 *                                no string is provided)
 * @returns {undefined}       - Doesn't return anything
 */
function addSingleColumn(config, content) {
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = config.currNumRows;
    let numCols = config.currNumColumns;

    let cell = table.rows[0].insertCell(numCols);
    cell.id = cellIndexToElementId(config.tableIds.theadElementId, 0, numCols);
    cell.classList.add("data-table-cell");

    let text = content || config.columnsName + " " + numCols;
    let middle = document.createTextNode(text);

    cell.appendChild(middle);

    for(let rowIndex = 1; rowIndex < numRows; rowIndex++){
        createEntryCell(config, table.rows[rowIndex], rowIndex, numCols);

    }

    config.currNumColumns += 1;
}

/**
 * Deletes a single Column from an existing table (delete from the bottom of the table)
 *
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleColumn(config) {
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = config.currNumRows;
    for (let i = 0; i < numRows; i++){
        table.rows[i].deleteCell(-1);
    }
    config.currNumColumns -= 1;
}

/**
 * Adds a single row to the table
 * @param {object} config       - Table configuration object
 * @param {String} [content]    - Content to place in the left-most cell of a row (uses default if
 *                                  no string is provided)
 * @returns {undefined}         - Doesn't return anything
 */
function addSingleRow(config, content) {
    // Insert a row into the body of the table
    let rowIndex = config.currNumRows - 1;
    let row = document.getElementById(config.tableIds.tbodyElementId).insertRow(rowIndex);
    // Then for each column
    for (let colIndex = 0; colIndex < config.currNumColumns; colIndex++) {
        // Create an entry cell
        if (colIndex === 0) {
            createRowHeader(config, row, rowIndex, colIndex, content)
        } else {
            createEntryCell(config, row, rowIndex, colIndex)
        }
    }

    config.currNumRows += 1;
}

// eslint-disable-next-line max-params
function createRowHeader(config, row, rowIndex, colIndex, content) {

    let cell = row.insertCell(colIndex);
    cell.id = cellIndexToElementId(config.wrapperDivId, rowIndex, colIndex)
    cell.classList.add("data-table-cell");

    if (content === undefined) {
        cell.innerHTML = (rowIndex + 1);
    } else {
        cell.innerHTML = content;
    }
}

/**
 * Adds a cell to a specific index on a passed-in row
 * @param {object} config           - Table configuration object
 * @param {HTMLTableRowElement} row - HTML table element to which the cell will be added
 * @param {Number} rowIndex         - The index of the row, used to create the cell's magic string
 * @param {Number} colIndex         - The index of the column, used to create the cell's magic string
 * @returns {undefined}             - Doesn't return anything
 */
function createEntryCell(config, row, rowIndex, colIndex) {

    let cell = row.insertCell(colIndex);
    cell.id = cellIndexToElementId(config.wrapperDivId, rowIndex, colIndex)
    cell.classList.add("data-table-cell");
    // add all the stuff from datumConfig
    for (let fieldNum = 0; fieldNum < config.datumConfig.names.length; fieldNum++) {
        let type = config.datumConfig.types[fieldNum];

        let label = document.createElement("LABEL");
        label.innerHTML = config.datumConfig.names[fieldNum] + ": ";
        label.classList.add('cell-label');

        let field = null;
        if (type === Number || type === String) {
            let input = document.createElement("INPUT");
            input.type = 'text';
            input.placeholder = config.datumConfig.values[fieldNum];
            input.classList.add('cell-input');
            field = input;
        } else if (type === Boolean) {
            let input = document.createElement("INPUT");
            input.type = 'checkbox';
            input.classList.add('cell-checkbox');
            input.defaultChecked = config.datumConfig.values[fieldNum];
            field = input;
        } else if (type === Array) {
            let select = document.createElement("select");
            select.type = 'dropdown';
            select.classList.add('cell-dropdown');
            for (let i = 0; i < config.datumConfig.values[fieldNum].length; i++) {
                let option = document.createElement("option");
                option.innerHTML = config.datumConfig.values[fieldNum][i];
                select.appendChild(option);
            }
            field = select;
        } else {
            /**
             * FIXME: This error handling could be improved. Maybe a try-catch block?
             */
            throw String("Cell field datatype not supported.");
        }

        if (cellFieldHasCallback(config, fieldNum)) {
            createCallbackListener(config, cell, field, fieldNum)
        }

        label.appendChild(field);
        cell.appendChild(label);
    }
}

/**
 * Checks if a given field has a callback associated with it
 * @param {object} config   - Table configuration object
 * @param {Number} fieldNum - Index of the field within the cell
 * @returns {boolean}       - Returns True if field has a callback
 */
function cellFieldHasCallback(config, fieldNum) {
    return config.datumConfig.callbacks[fieldNum] !== undefined && config.datumConfig.callbacks[fieldNum] !== null;
}

/**
 * Creates a callback listener, distinguishing between the type of field to which the callback applies
 * @param {object} config                               - Table configuration object
 * @param {HTMLTableDataCellElement} cell               - Cell within the table
 * @param {HTMLInputElement|HTMLSelectElement} field    - The field to which the callback applies
 * @param {Number} fieldNum                             - Index of the field within the cell
 * @returns {undefined}                                 - Doesn't return anything
 */
function createCallbackListener(config, cell, field, fieldNum) {

    field.addEventListener("focusout", function () {
        let fieldValue = null;

        // Gets value of the field, depending on what type of field it is
        if (field.type.toString() == 'text') {
            fieldValue = [field.value.trim()]
        } else if (field.type.toString() == 'checkbox') {
            fieldValue = [field.checked]
        } else if (field.type.toString() == 'dropdown') {
            fieldValue = config.datumConfig.values[fieldNum][field.selectedIndex]
        } else {
            throw String('Field has no class');
        }

        let callbackCode = Reflect.apply(config.datumConfig.callbacks[fieldNum], config.datumConfig.callbacks[1], [fieldValue]);
        handleCallbackReturn(config, cell, fieldNum, callbackCode);
    })
}

/**
 * Translates the return value of a callback to function calls
 * @param {object} config                   - Table configuration object
 * @param {HTMLTableDataCellElement} cell   - Cell within the table
 * @param {Number} fieldNum                 - Index of the field within the cell
 * @param {String} callbackCode             - Client's response to the field's value
 * @returns {undefined}                     - Doesn't return anything
 */
function handleCallbackReturn(config, cell, fieldNum, callbackCode) {
    /**
     * FIXME: Maybe we should be accepting an array of return "codes" to support multiple function calls?
     */
    let errorStringId = cell.id + fieldNum + '_error_';

    /**
     * FIXME: How can we improve callback code strings?
     */
    if (callbackCode === 'Invalid') {
        // Turns the cell red
        /**
         * FIXME: Instead of replacing this, have the invalid style be toggleable
         */
        cell.classList.replace('data-table-cell', 'invalid-cell');

        // And then adds an error message to the bottom of the cell
        let errorMessage = document.createElement("P");
        errorMessage.innerHTML = ("Invalid " + config.datumConfig.names[fieldNum].toLowerCase());
        errorMessage.classList.add('error-message');
        errorMessage.id = errorStringId;
        cell.appendChild(errorMessage);
    } else {
        // If the field entry is no longer invalid, change cell back to normal and remove error message
        if (cell.classList.contains('invalid-cell')) {
            cell.classList.replace('invalid-cell', 'data-table-cell');
            cell.removeChild(document.getElementById(errorStringId));
        }

        /**
         * TODO: Fill out this placeholder to handle other callback return codes
         */
        switch (callbackCode) {
            case 'placeholder':
                break;
            default:
                break;
        }
    }
}

/**
 * Deletes multiple rows from an existing table
 *
 * FIXME: This will work when deleting from the bottom of the table but might not from the middle!
 * TODO: Implement Serialization
 *
 * @param {object} config       - Table configuration object
 * @param {Number} numberOfRows - The number of rows to be deleted
 * @param {Number} rowIndex     - The index of the top-most row to be deleted
 * @returns {undefined}         - Doesn't return anything
 */
/**
function deleteRows(config, numberOfRows, rowIndex) {
    // Deletes from bottom up
    for (let rowNum = numberOfRows; rowNum >= 0; rowNum--) {
        deleteSingleRow(config, rowIndex + rowNum);
    }
}*/

/**
 * Deletes a single row from an existing table
 *
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleRow(config) {
    config.currNumRows -= 1;
    document.getElementById(config.tableIds.tbodyElementId).deleteRow(config.currNumRows - 1);
}

/**
 * Creates a magic string for a cell
 * @param {object} wrapperDivId - ID for the wrapper
 * @param {Number} rowIndex     - The row index for a cell
 * @param {Number} colIndex     - The column index for a cell
 * @returns {string}            - Returns a magic string unique to a cell, based on location
 */
function cellIndexToElementId(wrapperDivId, rowIndex, colIndex) {
    return '_' + wrapperDivId + "_row_" + rowIndex + "_and_col_" + colIndex + '_';
}

/**
 * Calls functions that create the two main entry boxes: one for rows, another for columns
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createEntryBox(config) {
    createColumnEntryBox(config);

    createRowEntryBox(config);
}

/**
 * Creates HTML elements by which the user can easily create rows with custom left-most cells.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createColumnEntryBox(config) {
    createColumnInputAndBtn(config);
    createColumnDeleteBtn(config);
}

/**
 * This function enables the user to enter the name of a row OR column,
 * a helper for createColumnInputAndBtn and createRowInputAndBtn.
 * @param {object} config        - Table configuration object
 * @param {object} leftPanelInfo - Info needed for the left panel, requiring several
 *                                 fields which are self-documenting: check the caller.
 * @returns {undefined}          - Doesn't return anything
 */
function createRowOrColumnInputAndBtn(config, leftPanelInfo) {
    let entryBoxDiv = document.getElementById(config.entryIds.entryBoxDivId);
    // Creates the field for text input
    let input = document.createElement("INPUT");
    input.type = 'text';
    input.id = leftPanelInfo.entryID;
    input.placeholder = "Number of " + leftPanelInfo.pluralNameLowerCase;
    input.classList.add('table-entry-field');

    // If the user hits enter while in the text box, click the addButton
    input.addEventListener("onClick", function() {
        addButton.click();
    })
    entryBoxDiv.appendChild(input);

    // Creates the button that will take the user input and send it to addSingleColumn() when clicked
    let addButton = document.createElement("button");
    addButton.classList.add("left-panel-button");
    addButton.innerHTML = "+ Add " + leftPanelInfo.nameLowerCase +
                          " to " + leftPanelInfo.endDirection;
    addButton.onclick = function () {
        let value = input.value.trim();
        leftPanelInfo.addEntryFunction(config, value);
        input.value = '';
    }
    entryBoxDiv.appendChild(addButton);
}

/**
 * This function enables the user to enter the name of a column. Creates a field for text input
 * as well as a button that sends input text to addSingleColumn().
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createColumnInputAndBtn(config) {
    const leftPanelInfo = {
        entryID: config.entryIds.colInputId,
        nameLowerCase: config.columnsName.toLowerCase(),
        pluralNameLowerCase: config.columnsNamePlural.toLowerCase(),
        endDirection: 'right',
        addEntryFunction: addSingleColumn
    };
    createRowOrColumnInputAndBtn(config, leftPanelInfo);
}

/**
 * Creates a button that will call deleteSingleColumn().
 * FIXME: This currently only deletes the table's bottom-most row.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createColumnDeleteBtn(config) {
    createDeleteBtn(config, {
        nameLowerCase: config.columnsName.toLowerCase(),
        deleteFunction: deleteSingleColumn
    });
}

/**
 * Creates HTML elements by which the user can easily create rows with custom left-most cells.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createRowEntryBox(config) {
    /**
     * TODO: Implement (editable?) container for already existing row names
     */

    createRowInputAndBtn(config);

    createRowDeleteBtn(config);
}

/**
 * This function enables the user to enter the name of a row. Creates a field for text input
 * as well as a button that sends input text to addSingleRow().
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createRowInputAndBtn(config) {
    const leftPanelInfo = {
        entryID: config.entryIds.rowInputId,
        nameLowerCase: config.rowsName.toLowerCase(),
        pluralNameLowerCase: config.rowsNamePlural.toLowerCase(),
        endDirection: 'bottom',
        addEntryFunction: addSingleRow
    };
    createRowOrColumnInputAndBtn(config, leftPanelInfo);
}

/**
 * Creates a button that will call deleteSingleRow() or deleteSingleColumn()
 * @param {object} config       - Table configuration object
 * @param {object} buttonConfig - Config for row vs column - see caller for required fields
 * @returns {undefined}         - Doesn't return anything
 */
function createDeleteBtn(config, buttonConfig) {
    let deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.innerHTML = "Delete a " + buttonConfig.nameLowerCase + " from the bottom";
    deleteBtn.classList.add("left-panel-button");
    deleteBtn.onclick = function () {
        buttonConfig.deleteFunction(config);
    }
    document.getElementById(config.entryIds.entryBoxDivId).appendChild(deleteBtn);
}

/**
 * Creates a button that will call deleteSingleRow().
 * FIXME: This currently only deletes the table's bottom-most row.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createRowDeleteBtn(config) {
    createDeleteBtn(config, {
        nameLowerCase: config.rowsName.toLowerCase(),
        deleteFunction: deleteSingleRow
    });
}

/**
 * This function clears out an old table and reinitialize it with the previously passed-in clientConfig
 * @param {object} clientConfig - Client configuration requests
 * @returns {undefined}         - Doesn't return anything
 */
function createResetButton(clientConfig) {
    let wrapperDiv = document.getElementById(clientConfig.wrapperDivId);

    let resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.innerHTML = "Reset the table";

    // Clears the wrapper div, deletes the old config object, and calls dtCreateDataTable again
    resetBtn.onclick = function () {
        wrapperDiv.innerHTML = '';
        Reflect.deleteProperty(configDict, clientConfig.wrapperDivId);
        dtCreateDataTable(clientConfig);
    }
    wrapperDiv.appendChild(resetBtn);
}

    /**
// eslint-disable-next-line no-unused-vars
/** function toJSON() {
     * Parses data held in HTML to JSON and sends it to client
     * TODO: Fill this out
     * TODO: Implement Serialization
} */

/**
 * Public functions below
 */

/**
 * Function available to client in order to create a datatable.
 * @param {object} clientConfig - Client configuration requests
 * @returns {undefined}         - Doesn't return anything
 */
function dtCreateDataTable(clientConfig) {
    setConfig(clientConfig);

    createSubDivs(configDict[clientConfig.wrapperDivId]);

    createTable(configDict[clientConfig.wrapperDivId]);

    createResetButton(clientConfig);

    createEntryBox(configDict[clientConfig.wrapperDivId])

}

// eslint-disable-next-line no-unused-vars
/** function dtDisableField(row, col, fieldName) {
     * Calls getFieldId() then disables a specific field in a specific cell
     * TODO: Fill this out
     * TODO: Implement Serialization
} */

// eslint-disable-next-line no-unused-vars
/** function dtEnableField(row, col, fieldName) {
     * Calls getFieldId() then enables a specific field in a specific cell
     * TODO: Fill this out
     * TODO: Implement Serialization
} */

// eslint-disable-next-line no-unused-vars
/** function dtDisableCell(row, col) {
     * Calls getCellId() then disables all fields of a specific cell
     * TODO: Fill this out
     * TODO: Implement Serialization
} */

// eslint-disable-next-line no-unused-vars
/** function dtEnableCell(row, col) {
     * Calls getCellId() then enables all fields of a specific cell
     * TODO: Fill this out
     * TODO: Implement Serialization
} */

// eslint-disable-next-line no-unused-vars
/** function dtSetFieldValue(row, col, fieldName, value) {
     * Calls getFieldId() then updates a specific field in a
     * specific cell to a given value
     * TODO: Fill this out
     * TODO: Implement Serialization
} */

// eslint-disable-next-line no-unused-vars
/** function dtGetFieldValue(row, col, fieldName, value) {
     * Calls getFieldId() then retrieves a value from
     * a specific field in a specific cell
     * TODO: Fill this out
     * TODO: Implement Serialization
} */


// In case of node.js
/* eslint no-undef: ["off"] */
if (typeof exports !== typeof undefined) {
    exports.createDataTable = dtCreateDataTable;
}
