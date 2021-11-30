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
     * @property {bool}   canEditRowHeader    - Are the row names editable?
     * @property {bool}   canEditColumnHeader - Are the column names editable?
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
        this.canEditRowHeader = clientConfig.canEditRowHeader === undefined ? true : clientConfig.canEditRowHeader;
        this.canEditColumnHeader = clientConfig.canEditColumnHeader === undefined ? false : clientConfig.canEditColumnHeader;

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

        cell.appendChild(createColumnHeaderCell(config, colIndex));
    }

    config.currNumColumns = config.defaultNumColumns + 1;
    config.currNumRows = 1;
}

function createColumnHeaderCell(config, colIndex) {
    if (colIndex === 0) {
        return document.createTextNode(config.rowsNamePlural);
    }
    if (!config.canEditColumnHeader) {
        let cellText = config.columnsName + " " + colIndex;
        return document.createTextNode(cellText);
    }

    // Creates the field for text input
    let input = document.createElement("INPUT");
    input.type = 'text';
    input.placeholder = config.columnsName;
    input.classList.add('table-entry-field');
    return input;
}

function createRowHeaderCell(config, rowIndex) {
    if (!config.canEditRowHeader) {
        let cellText = config.rowsName + " " + rowIndex;
        return document.createTextNode(cellText);
    }

    // Creates the field for text input
    let input = document.createElement("INPUT");
    input.type = 'text';
    input.placeholder = config.rowsName;
    input.classList.add('table-entry-field');
    return input;
}

/**
 * Adds a single column to the table
 * @param {object} config     - Table configuration object
 * @param {String} [content]  - Content to place in the top cell of a column (uses default if
 *                                no string is provided)
 * @returns {undefined}       - Doesn't return anything
 */
function addSingleColumn(config) {
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = config.currNumRows;
    let numCols = config.currNumColumns;

    let cell = table.rows[0].insertCell(numCols);
    cell.id = cellIndexToElementId(config.tableIds.theadElementId, 0, numCols);
    cell.classList.add("data-table-cell");

    cell.appendChild(createColumnHeaderCell(config, numCols));

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
function addSingleRow(config) {
    // Insert a row into the body of the table
    let rowIndex = config.currNumRows;
    let row = document.getElementById(config.tableIds.tbodyElementId).insertRow(rowIndex - 1);
    // Then for each column
    for (let colIndex = 0; colIndex < config.currNumColumns; colIndex++) {
        // Create an entry cell
        if (colIndex === 0) {
            createRowHeader(config, row, rowIndex, colIndex)
        } else {
            createEntryCell(config, row, rowIndex, colIndex)
        }
    }

    config.currNumRows += 1;
}

// eslint-disable-next-line max-params
function createRowHeader(config, row, rowIndex, colIndex) {
    let cell = row.insertCell(colIndex);
    cell.id = cellIndexToElementId(config.wrapperDivId, rowIndex, colIndex)
    cell.classList.add("data-table-cell");
    cell.appendChild(createRowHeaderCell(config, rowIndex));
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
        if (field.type.toString() === 'text') {
            fieldValue = [field.value.trim()]
        } else if (field.type.toString() === 'checkbox') {
            fieldValue = [field.checked]
        } else if (field.type.toString() === 'dropdown') {
            fieldValue = [field.value]
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
    return wrapperDivId + "_row_" + rowIndex + "_and_col_" + colIndex + "_";
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

    // Creates the button that will take the user input and send it to addSingleColumn() when clicked
    let addButton = document.createElement("button");
    addButton.classList.add("left-panel-button");
    addButton.innerHTML = "+ Add " + leftPanelInfo.name.toLowerCase() +
                          " to " + leftPanelInfo.endDirection;
    addButton.onclick = function () {
        leftPanelInfo.addEntryFunction(config);
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
        name: config.columnsName,
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
        deleteFunction: deleteSingleColumn,
        endDirection: 'right'
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
        name: config.rowsName,
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
    deleteBtn.innerHTML = "Delete a " + buttonConfig.nameLowerCase +
                          " from the " + buttonConfig.endDirection;
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
        deleteFunction: deleteSingleRow,
        endDirection: 'bottom'
    });
}

/**
 * This button causes a JSON object containing the table's
 * contents to be printed to the console
 * @param {object} clientConfig - Client configuration requests
 * @returns {undefined}         - Doesn't return anything
 */
function createJSONButton(clientConfig) {
    let wrapperDiv = document.getElementById(clientConfig.wrapperDivId);

    let JSONBtn = document.createElement("button");
    JSONBtn.type = "button";
    JSONBtn.innerHTML = "Print JSON to console";

    JSONBtn.onclick = function () {
        // eslint-disable-next-line no-console
        console.log(dtToJSON(clientConfig));
    }
    wrapperDiv.appendChild(JSONBtn);
}

/**
 * Returns the HTML element corresponding to a cell at a specific index
 * @param {object} config           - Table configuration object
 * @param {Number} row              - Row on which the cell is located
 * @param {Number} column           - Column in which the cell is located
 * @returns {HTMLTableCellElement}  - HTML element of a specific cell
 */
function getCellElement(config, row, column) {
    return document.getElementById(cellIndexToElementId(config.wrapperDivId, row, column))
}

/**
 * Gets a 2D array containing all data from all fields of all cells in the table
 * @param {object} config   - Table configuration object
 * @returns {*[]}           - 2D array of cell objects
 */
function getTableData(config) {
    let tableData = [];
    for (let row = 0; row < config.numRows; row++) {
        tableData.push(getRowData(config, row));
    }
    return tableData;
}

/**
 * Gets a 1D array containing all data from all fields of all cells in a specific row of the table
 * @param {object} config   - Table configuration object
 * @param {Number} row      - Specific row to pull data from
 * @returns {*[]}           - 1D array of cell objects
 */
function getRowData(config, row) {
    let rowData = [];
    for (let col = 1; col < config.numColumns; col++) {
        rowData.push(getCellData(config, row, col));
    }
    return rowData
}

/**
 * Gets an object containing all data from all fields of a specific cell
 * @param {object} config   - Table configuration object
 * @param {Number} row      - Row index for the cell
 * @param {Number} col      - Column index for the cell
 * @returns {object}        - Object containing cell data in the following format: {[fieldName]:[fieldValue],...}
 */
function getCellData(config, row, col) {
    let cellData = {};
    let cell = getCellElement(config, row, col);

    /*
    Assumes that each cell has only field labels as children
     */
    cell.childNodes.forEach(function (label, index) {
        /*
        Assumes that each label has two children. The first is
        text containing the label's name and the second is the
        space the user can interact with.
         */
        let value = null;
        switch (config.datumConfig.types[index]) {
            case Number:
                value = parseInt(label.childNodes[1].value, 10);
                break;
            case Boolean:
                value = label.childNodes[1].checked;
                break;
            case String:
            case Array:
                value = label.childNodes[1].value;
                break;
            default:
                throw String("Label " + label.innerHTML + " does not have a supported field.");
        }
        /**
         * FIXME: How do we want cell properties to be named? Do we care about lowercase?
         */
        cellData[config.datumConfig.names[index].toLowerCase()] = value;
    })
    return cellData;
}

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

    /**
     * FIXME: Remove this function call and declaration when done testing
     */
    createJSONButton(clientConfig);

    createEntryBox(configDict[clientConfig.wrapperDivId]);
}

/**
 * Parses data held in HTML to JSON and sends it to client
 * @param {object} clientConfig - the config
 * @returns {object} jsonObject - the JSON string object
 * */
function dtToJSON(clientConfig) {
    let config = configDict[clientConfig.wrapperDivId];
    let rowNames = [];
    for (let row = 0; row < config.numRows; row++) {
        rowNames[row] = getCellElement(config, row, 0).innerHTML;
    }
    // Currently don't support custom column names
    let columnNames = [];
    let data = getTableData(config);
    let jsonObject = {
        "version": 1,
        rowNames,
        columnNames,
        data
    }
    return JSON.stringify(jsonObject)
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
    exports.toJSON = dtToJSON;
}
