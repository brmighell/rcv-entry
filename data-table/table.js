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
            callbacks: clientConfig.callbacks === undefined ? [null, null] : clientConfig.callbacks
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
    let entryBoxDiv = document.createElement("div");
    entryBoxDiv.id = config.entryIds.entryBoxDivId;
    entryBoxDiv.classList.add("dt_left-panel");

    let tableDiv = document.createElement("div");
    tableDiv.id = config.tableIds.tableDivId;
    entryBoxDiv.classList.add("dt_right-panel");

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
    table.classList.add("dt_inner-table");

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
        cell.id = constructElementId(config.tableIds.theadElementId, 0, colIndex)
        cell.classList.add("dt_cell");

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
    input.classList.add('dt_table-entry-field');
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
    input.classList.add('dt_table-entry-field');
    return input;
}

/**
 * Helper function to create a nonsubmitting button, properly styled
 * @param {string} text   - The button text
 * @returns {object}      - The button DOM element
 */
function createLeftPanelButton(text) {
    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("dt_left-panel-button");
    button.innerHTML = text;
    return button;
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
    cell.id = constructElementId(config.tableIds.theadElementId, 0, numCols);
    cell.classList.add("dt_cell");

    cell.appendChild(createColumnHeaderCell(config, numCols));

    for(let rowIndex = 1; rowIndex < numRows; rowIndex++){
        createEntryCell(config, table.rows[rowIndex], rowIndex, numCols);

    }

    config.currNumColumns += 1;
}

/**
 * Deletes a single Column from an existing table (delete from the bottom of the table)
 * TODO: when only 1 cell remaining, disable the delete button instead of just doing nothing
 *
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleColumn(config) {
    // Must have at least 1 row and col (or 2 when accounting for headers)
    if (config.currNumColumns == 2) {
        return;
    }

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
    cell.id = constructElementId(config.wrapperDivId, rowIndex, colIndex)
    cell.classList.add("dt_cell");
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
    cell.id = constructElementId(config.wrapperDivId, rowIndex, colIndex)
    cell.classList.add("dt_cell");
    // add all the stuff from datumConfig
    for (let fieldNum = 0; fieldNum < config.datumConfig.names.length; fieldNum++) {
        let type = config.datumConfig.types[fieldNum];
        let fieldName = config.datumConfig.names[fieldNum];

        let label = document.createElement("LABEL");
        label.innerHTML = fieldName + ": ";
        label.classList.add('dt_cell-label');

        let field = null;
        if (type === Number || type === String) {
            let input = document.createElement("INPUT");
            input.type = 'text';
            input.placeholder = config.datumConfig.values[fieldNum];
            input.classList.add('dt_cell-input');
            field = input;
        } else if (type === Boolean) {
            let input = document.createElement("INPUT");
            input.type = 'checkbox';
            input.classList.add('dt_cell-checkbox');
            input.defaultChecked = config.datumConfig.values[fieldNum];
            field = input;
        } else if (type === Array) {
            let select = document.createElement("select");
            select.type = 'dropdown';
            select.classList.add('dt_cell-dropdown');
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

        field.id = constructInputFieldId(config.wrapperDivId, rowIndex, colIndex, fieldNum);

        if (cellFieldHasCallback(config, fieldNum)) {
            field.addEventListener("focusout", function () {
                const fieldValue = getCellData(config, rowIndex, colIndex)[fieldName];
                const errorMessage = config.datumConfig.callbacks[fieldNum](fieldValue, rowIndex-1, colIndex-1);
                handleCallbackReturn(config, cell, fieldNum, errorMessage);
            })
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
 * Translates the return value of a callback to function calls
 * @param {object} config                   - Table configuration object
 * @param {HTMLTableDataCellElement} cell   - Cell within the table
 * @param {Number} fieldNum                 - Index of the field within the cell
 * @param {String} errorMessage             - Client's response to the field's value (null if no error)
 * @returns {undefined}                     - Doesn't return anything
 */
function handleCallbackReturn(config, cell, fieldNum, errorMessage) {
    /**
     * FIXME: Maybe we should be accepting an array of return "codes" to support multiple function calls?
     */
    let errorStringId = cell.id + fieldNum + '_error_';

    if (errorMessage !== null && errorMessage !== undefined) {
        // Turns the cell red
        /**
         * FIXME: Instead of replacing this, have the invalid style be toggleable
         */
        cell.classList.replace('dt_cell', 'dt_invalid-cell');

        // And then adds an error message to the bottom of the cell
        let errorMessageElement = document.createElement("P");
        errorMessageElement.innerHTML = errorMessage;
        errorMessageElement.classList.add('dt_error-message');
        errorMessageElement.id = errorStringId;
        cell.appendChild(errorMessageElement);
    } else if (cell.classList.contains('dt_invalid-cell')) {
        // If the field entry is no longer invalid, change cell back to normal and remove error message
        cell.classList.replace('dt_invalid-cell', 'dt_cell');
        cell.removeChild(document.getElementById(errorStringId));
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
 * TODO: when only 1 cell remaining, disable the delete button instead of just doing nothing
 *
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleRow(config) {
    // Must have at least 1 row and col (or 2 when accounting for headers)
    if (config.currNumRows == 2) {
        return;
    }

    config.currNumRows -= 1;
    document.getElementById(config.tableIds.tbodyElementId).deleteRow(config.currNumRows - 1);
}

/**
 * Creates a magic string to be the cell ID
 * @param {object} wrapperDivId - ID for the wrapper
 * @param {Number} rowIndex     - The row index for a cell
 * @param {Number} colIndex     - The column index for a cell
 * @returns {string}            - Returns a magic string unique to a cell, based on location
 */
function constructElementId(wrapperDivId, rowIndex, colIndex) {
    return wrapperDivId + "_row_" + rowIndex + "_and_col_" + colIndex + "_";
}

/**
 * Creates a magic string to be the field input ID
 * @param {object} wrapperDivId - ID for the wrapper
 * @param {Number} rowIndex     - The row index for a cell
 * @param {Number} colIndex     - The column index for a cell
 * @param {Number} fieldIndex   - The index of the field
 * @returns {string}            - Returns a magic string unique to a field input within a cell, based on location
 */
function constructInputFieldId(wrapperDivId, rowIndex, colIndex, fieldIndex) {
    return wrapperDivId + "_row_" + rowIndex + "_and_col_" + colIndex + "_and_field_" + fieldIndex + "_";
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
    let addButton = createLeftPanelButton("+ Add " + leftPanelInfo.name.toLowerCase() +
                                          " to " + leftPanelInfo.endDirection);
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
    let deleteBtn = createLeftPanelButton("Delete a " + buttonConfig.nameLowerCase +
                                          " from the " + buttonConfig.endDirection);
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
        console.log(dtToJSON(clientConfig.wrapperDivId));
    }
    wrapperDiv.appendChild(JSONBtn);
}

/**
 * Returns the HTML element corresponding to a cell at a specific index
 * @param {object} config           - Table configuration object
 * @param {Number} row              - Row on which the cell is located, indexed including headers
 * @param {Number} column           - Column in which the cell is located, indexed including headers
 * @returns {HTMLTableCellElement}  - HTML element of a specific cell
 */
function getCellElement(config, row, column) {
    if (row < 1 || row >= config.currNumRows) {
        throw new Error("Invalid row number");
    }
    if (column < 1 || column >= config.currNumColumns) {
        throw new Error("Invalid column number");
    }
    return document.getElementById(constructElementId(config.wrapperDivId, row, column))
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
 * @param {Number} row      - Row index for the cell, indexed including headers
 * @param {Number} col      - Column index for the cell, indexed including headers
 * @returns {object}        - Object containing cell data in the following format: {[fieldName]:[fieldValue],...}
 */
function getCellData(config, row, col) {
    let cellData = {};
    let cell = getCellElement(config, row, col);

    /*
    Assumes that all labels under this child are, in order, the labels we created for the data types
     */
    const labels = cell.getElementsByTagName("label");
    for (let index = 0; index < labels.length; ++index) {
        /*
        Assumes that each label has two children. The first is
        text containing the label's name and the second is the
        space the user can interact with.
         */
        const label = labels[index];
        const node = label.childNodes[1];

        let value = null;
        const type = config.datumConfig.types[index];
        switch (type) {
            case Number:
                value = parseInt(node.value, 10);
                break;
            case Boolean:
                value = node.checked;
                break;
            case String:
            case Array:
                value = node.value;
                break;
            default:
                throw String("Label " + label.innerHTML + " does not have a supported field: " + type);
        }

        if (node.disabled) {
            // Disabled nodes should not return a value
            value = null;
        }

        cellData[config.datumConfig.names[index]] = value;
    }
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
 * Function available to client in order to get the data at a specified cell
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @param {int} row             - the row of the cell, 0-indexed (i.e. not including headers)
 * @param {int} col             - the column of the cell, 0-indexed (i.e. not including headers)
 * @returns {object}            - Dictionary in the following format: {[fieldName]:[fieldValue],...}
 */
function dtGetCellData(wrapperDivId, row, col) {
    let config = configDict[wrapperDivId];
    return getCellData(config, row + 1, col + 1);
}

/**
 * Function available to client in order to mark an arbitrary cell as having invalid data
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @param {int} row             - the row of the cell, 0-indexed (i.e. not including headers)
 * @param {int} col             - the column of the cell, 0-indexed (i.e. not including headers)
 * @param {string} message      - the error message to display
 * @returns {undefined}         - Doesn't return anything
 */
// eslint-disable-next-line no-unused-vars
function dtSetCellErrorMessage(wrapperDivId, row, col, message) {
    throw new Error("Not implemented yet");
}

/**
 * Function available to client in order to clear an arbitrary cell's error message
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @param {int} row             - the row of the cell, 0-indexed (i.e. not including headers)
 * @param {int} col             - the column of the cell, 0-indexed (i.e. not including headers)
 * @returns {undefined}         - Doesn't return anything
 */
// eslint-disable-next-line no-unused-vars
function dtClearCellErrorMessage(wrapperDivId, row, col) {
    throw new Error("Not implemented yet");
}

/**
 * Function available to client in order to disable an arbitrary field
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @param {int} row             - the row of the cell, 0-indexed (i.e. not including headers)
 * @param {int} col             - the column of the cell, 0-indexed (i.e. not including headers)
 * @param {int} fieldIndex      - the field index of the cell
 * @returns {undefined}         - Doesn't return anything
 */
function dtDisableField(wrapperDivId, row, col, fieldIndex) {
    const fieldId = constructInputFieldId(wrapperDivId, row+1, col+1, fieldIndex);
    document.getElementById(fieldId).disabled = true;
}

/**
 * Undoes dtDisableField
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @param {int} row             - the row of the cell, 0-indexed (i.e. not including headers)
 * @param {int} col             - the column of the cell, 0-indexed (i.e. not including headers)
 * @param {int} fieldIndex      - the field index of the cell
 * @returns {undefined}         - Doesn't return anything
 */
function dtEnableField(wrapperDivId, row, col, fieldIndex) {
    const fieldId = constructInputFieldId(wrapperDivId, row+1, col+1, fieldIndex);
    document.getElementById(fieldId).disabled = false;
}

/**
 * Function available to client in order to get the number of rows
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @returns {int}               - Number of rows of data (i.e. not including the header row)
 */
function dtGetNumRows(wrapperDivId) {
    let config = configDict[wrapperDivId];
    return config.currNumRows - 1;
}

/**
 * Function available to client in order to get the number of columns
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @returns {int}               - Number of columns of data (i.e. not including the header column)
 */
function dtGetNumColumns(wrapperDivId) {
    let config = configDict[wrapperDivId];
    return config.currNumColumns - 1;
}

/**
 * Parses data held in HTML to JSON and sends it to client
 * @param {object} wrapperDivId - the wrapper div ID originally passed to dtCreateDataTable
 * @returns {object} jsonObject - the JSON string object
 * */
function dtToJSON(wrapperDivId) {
    let config = configDict[wrapperDivId];
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
    exports.getCellData = dtGetCellData;
    exports.getNumRows = dtGetNumRows;
    exports.getNumColumns = dtGetNumColumns;
    exports.setCellErrorMessage = dtSetCellErrorMessage;
    exports.disableField = dtDisableField;
    exports.enableField = dtEnableField;
    exports.clearCellErrorMessage = dtClearCellErrorMessage;
    exports.toJSON = dtToJSON;
}
