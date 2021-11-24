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
        this.numRows = clientConfig.numRows === undefined ? 3 : clientConfig.numRows;
        /* numColumns also accounts for row names - assumes that the user is asking for:
           "this many columns plus one column for row names" */
        this.numColumns = clientConfig.numColumns === undefined ? 4 : clientConfig.numColumns + 1;
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
            tableDivId: '_tableDivId_' + clientConfig.wrapperDivId,
            tableElementId: '_tableId_' + clientConfig.wrapperDivId,
            theadElementId: '_theadId_' + clientConfig.wrapperDivId,
            tbodyElementId: '_tbodyId_' + clientConfig.wrapperDivId
        }

        this.entryIds = {
            entryBoxDivId: '_entryBoxDivId_' + clientConfig.wrapperDivId,
            colInputId: '_colInputId_' + clientConfig.wrapperDivId,
            rowInputId: '_rowInputId_' + clientConfig.wrapperDivId
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

    if (clientConfig.wrapperDivId === undefined) {
        throw new Error("An ID for the wrapper div is required");
    }

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

    if (config.numColumns <= 0 || config.numRows <= 0) {
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
    addMultipleRows(config, config.numRows, 0);
}

function createColumnHeader(config) {
    // Insert a row into the body of the table
    let row = document.getElementById(config.tableIds.theadElementId).insertRow(0);
    // Then for each column
    for (let colIndex = 0; colIndex < config.numColumns; colIndex++) {
        // Create an entry cell
        let cell = row.insertCell(colIndex);
        cell.id = cellIndexToElementId(config.tableIds.theadElementId, 0, colIndex)
        cell.classList.add("data-table-cell");

        let cellText = colIndex === 0 ? config.rowsNamePlural : config.columnsName + " " + colIndex;
        cell.appendChild(document.createTextNode(cellText));
    }
}

/**
 * Adds columns to the table.
 * @param {object} config       - Table configuration object
 * @param {Number} numberOfColumns - Number of columns to be added
 * @returns {undefined}         - Doesn't return anything
 */
 function addMultipleColumns(config, numberOfColumns) {
    for(let i = 0; i < numberOfColumns; i++){
        addSingleColumn(config);
    }
}

/**
 * Adds a single column to the table
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function addSingleColumn(config){
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = table.rows.length; // get length row right now
    let numCols = table.rows[0].cells.length;

    let cell = table.rows[0].insertCell(numCols);
    cell.id = cellIndexToElementId(config.tableIds.theadElementId, 0, numCols);
    cell.classList.add("data-table-cell");

    let middle = document.createTextNode(config.columnsName + " " + numCols);

    cell.appendChild(middle);

    for(let rowIndex = 1; rowIndex < numRows; rowIndex++){
        createEntryCell(config, table.rows[rowIndex], rowIndex, numCols);

    }
    config.numColumns += 1;
}

/**
 * Deletes multiple Columns from an existing table
 *
 * TODO: Implement Serialization
 *
 * @param {object} config       - Table configuration object
 * @param {Number} numberOfColumns - The number of columns to be deleted
 * @returns {undefined}         - Doesn't return anything
 */
function deleteColumns(config, numberOfColumns) {
    for(let i = 0; i < numberOfColumns; i++){
        deleteSingleColumn(config);
    }
}

/**
 * Deletes a single Column from an existing table (delete from the bottom of the table)
 *
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleColumn(config) {
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = table.rows.length; // get length row right now
    for (let i = 0; i < numRows; i++){
        table.rows[i].deleteCell(-1);
    }
    config.numColumns -= 1;
}

/**
 * Adds rows to the table.
 * @param {object} config       - Table configuration object
 * @param {Number} numberOfRows - Number of rows to be added
 * @param {Number} index        - Vertical index where to start adding rows
 * @returns {undefined}         - Doesn't return anything
 */
function addMultipleRows(config, numberOfRows, index) {
    // For each of the newly requested rows
    for (let newRow = 0; newRow < numberOfRows; newRow++) {
        // The third argument of addSingleRow is optional and can be safely omitted.
        addSingleRow(config, index + newRow);
    }
}

/**
 * Adds a single row to the table
 * @param {object} config       - Table configuration object
 * @param {Number} rowIndex     - Where to insert the row
 * @param {String} [content]    - Content to place in the left-most cell of a row (uses default if
 *                                  no string is provided)
 * @returns {undefined}         - Doesn't return anything
 */
function addSingleRow(config, rowIndex, content) {
    // Insert a row into the body of the table
    let row = document.getElementById(config.tableIds.tbodyElementId).insertRow(rowIndex);
    // Then for each column
    for (let colIndex = 0; colIndex < config.numColumns; colIndex++) {
        // Create an entry cell
        if (colIndex === 0) {
            createRowHeader(config, row, rowIndex, colIndex, content)
        } else {
            createEntryCell(config, row, rowIndex, colIndex)
        }
    }

    if (rowIndex >= config.numRows) {
        config.numRows += 1;
    }
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
    let errorStringId = cell.id + fieldNum + '_error';

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
 * FIXME: This works when deleting from the bottom of the table. It does not support deleting from the middle!
 *
 * @param {object} config   - Table configuration object
 * @param {Number} rowIndex - Index of the row to be deleted
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleRow(config, rowIndex) {
    document.getElementById(config.tableIds.tbodyElementId).deleteRow(rowIndex);
    config.numRows -= 1;
}

/**
 * Creates a magic string for a cell
 * @param {object} wrapperDivId - ID for the wrapper
 * @param {Number} rowIndex     - The row index for a cell
 * @param {Number} colIndex     - The column index for a cell
 * @returns {string}            - Returns a magic string unique to a cell, based on location
 */
function cellIndexToElementId(wrapperDivId, rowIndex, colIndex) {
    return wrapperDivId + "_row_" + rowIndex + "_and_col_" + colIndex;
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
 * This function enables the user to enter the name of a column. Creates a field for text input
 * as well as a button that sends input text to addSingleColumn().
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createColumnInputAndBtn(config) {
    let entryBoxDiv = document.getElementById(config.entryIds.entryBoxDivId);
    // Creates the field for text input
    let input = document.createElement("INPUT");
    input.type = 'text';
    input.id = config.entryIds.colInputId;
    input.placeholder = "Number of " + config.columnsNamePlural.toLowerCase();
    input.classList.add('enter-row-name');

    // If the user hits enter while in the text box, click the addColumnBtn
    input.addEventListener("keyup", function(event) {
        event.preventDefault();

        if (event.code === "Enter") {
            addColumnBtn.click();
        }
    })
    entryBoxDiv.appendChild(input);

    // Creates the button that will take the user input and send it to addSingleColumn() when clicked
    /**
     * TODO: Button will need to accept a number of columns from the user then pass that number to addMultipleColumns
     */
    let addColumnBtn = document.createElement("button");
    addColumnBtn.classList.add("add-row-button");
    addColumnBtn.innerHTML = "+ Add " + config.columnsName.toLowerCase() + " to right";
    addColumnBtn.onclick = function () {
        let value = input.value.trim();
        if (value !== '') {
            addMultipleColumns(config, parseInt(value, 10));
        } else {
            addSingleColumn(config);
        }
        input.value = '';
    }
    entryBoxDiv.appendChild(addColumnBtn);
}

/**
 * Creates a button that will call deleteSingleColumn().
 * FIXME: This currently only deletes the table's bottom-most row.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createColumnDeleteBtn(config) {
    let deleteColumnBtn = document.createElement("button");
    deleteColumnBtn.innerHTML = "Delete " + config.columnsName.toLowerCase() + " from right";
    deleteColumnBtn.classList.add("add-row-button");
    deleteColumnBtn.onclick = function () {
        let input = document.getElementById(config.entryIds.colInputId);
        let value = input.value.trim();
        if (value !== '') {
            deleteColumns(config, parseInt(value, 10));
        } else {
            deleteSingleColumn(config);
        }
        input.value = '';
    }
    document.getElementById(config.entryIds.entryBoxDivId).appendChild(deleteColumnBtn);
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
    let entryBoxDiv = document.getElementById(config.entryIds.entryBoxDivId);

    // Creates the field for text input
    /**
     * TODO: Consider changing "input" to "textarea" to support multiline input
     */
    let input = document.createElement("INPUT");
    input.type = 'text';
    input.id = config.entryIds.rowInputId;
    input.placeholder = "Enter " + config.rowsName.toLowerCase() + " name";
    input.classList.add('enter-row-name');

    // If the user hits enter while in the text box, click the addRowBtn
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        /**
         * FIXME: This might cause an error for mobile users. Potentially there's a better way than waiting for "enter"?
         */
        if (event.code === "Enter") {
            addRowBtn.click();
        }
    })
    entryBoxDiv.appendChild(input);

    // Creates the button that will take the user input and send it to addSingleRow() when clicked
    let addRowBtn = document.createElement("button");
    addRowBtn.type = "button";
    addRowBtn.innerHTML = "+ Add a " + config.rowsName.toLowerCase() + " to the bottom";
    addRowBtn.classList.add("add-row-button");
    addRowBtn.onclick = function () {
        let value = input.value.trim();
        if (value !== '') {
            addSingleRow(config, config.numRows, value);
        } else {
            addSingleRow(config, config.numRows);
        }
        input.value = '';
    }
    entryBoxDiv.appendChild(addRowBtn);
}

/**
 * Creates a button that will call deleteSingleRow().
 * FIXME: This currently only deletes the table's bottom-most row.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createRowDeleteBtn(config) {
    let deleteRowBtn = document.createElement("button");
    deleteRowBtn.type = "button";
    deleteRowBtn.innerHTML = "Delete a " + config.rowsName.toLowerCase() + " from the bottom";
    deleteRowBtn.classList.add("add-row-button") // this is just a temp. The icon will be replaced.
    deleteRowBtn.onclick = function () {
        deleteSingleRow(config, config.numRows - 1);
    }
    document.getElementById(config.entryIds.entryBoxDivId).appendChild(deleteRowBtn);
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
    let index = 0;

    /*
    Assumes that each cell has only field labels as children
     */
    cell.childNodes.forEach(function (label) {
        /*
        Assumes that each label has two children. The first is
        text containing the label's name and the second is the
        space the user can interact with.
         */
        let value = "";
        switch (config.datumConfig.types[index]) {
            case Number:
                value = parseInt(label.childNodes[1].value, 10) || config.datumConfig.values[index];
                break;
            case Boolean:
                value = label.childNodes[1].checked;
                break;
            default:
                value = label.childNodes[1].value;
        }
        cellData[config.datumConfig.names[index].toLowerCase()] = value;
        index += 1;
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
    // toJSON(configDict[clientConfig.wrapperDivId]);
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
    exports.validateConfig = validateConfig;
}
