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
     * @property {object} tableIds      - Container for all the table's magic strings
     * @property {object} datumConfig   - Container for default values of a cell
     */
    constructor(clientConfig) {
        this.numRows = clientConfig.numRows === undefined ? 3 : clientConfig.numRows;
        this.numColumns = clientConfig.numColumns === undefined ? 3 : clientConfig.numColumns;

        /**
         * @property {string} wrapperDivId      - ID for the div passed in by the client
         * @property {string} tableDivId        - ID for the div containing the table
         * @property {string} entryBoxDivId     - ID for the div containing the entry box
         * @property {string} tableElementId    - Id for the entire table element
         * @property {string} theadElementId    - ID for the table's first row (column headers) element
         * @property {string} tbodyElementId    - ID for the table's body element
         */
        this.tableIds = {
            wrapperDivId: clientConfig.wrapperDivId,
            tableDivId: '_tableDivId_' + clientConfig.wrapperDivId,
            entryBoxDivId: '_entryBoxDivId_' + clientConfig.wrapperDivId,
            tableElementId: '_tableId_' + clientConfig.wrapperDivId,
            theadElementId: '_theadId_' + clientConfig.wrapperDivId,
            tbodyElementId: '_tbodyId_' + clientConfig.wrapperDivId
        }

        /**
         * @property {object} names     - Array of the names for all fields in a cell | Default: ["Value"]
         * @property {object} types     - Array of the types for all fields in a cell | Default: [Number]
         * @property {object} defaults  - Array of the defaults for all fields in a cell | Default: [0]
         * @property {object} callbacks - Tells what function to execute when a field is changed | Default: ["None"]
         */
        this.datumConfig = {
            names: clientConfig.names === undefined ? ["Value"] : clientConfig.names,
            types: clientConfig.types === undefined ? [Number] : clientConfig.types,
            values: clientConfig.values === undefined ? [0] : clientConfig.values,
            callbacks: clientConfig.callbacks === undefined ? ["None"] : clientConfig.callbacks
        }
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
 * @throws Error            - If any required option is not provided
 */
function validateConfig(config) {

    if (config.numColumns <= 0 || config.numRows <= 0) {
        throw new Error("The table must have at least one column and one row!")
    }
}

/**
 * Creates two sub divs and inserts them into the wrapper div
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createSubDivs(config) {
    let entryBoxDiv = document.createElement("div");
    entryBoxDiv.id = config.tableIds.entryBoxDivId;

    let tableDiv = document.createElement("div");
    tableDiv.id = config.tableIds.tableDivId;

    let text = document.createTextNode("~~This is where the entry box will live~~");
    entryBoxDiv.appendChild(text);

    document.getElementById(config.tableIds.wrapperDivId).appendChild(entryBoxDiv);
    document.getElementById(config.tableIds.wrapperDivId).appendChild(tableDiv);
}

/**
 * Creates an HTML table and assigns unique element IDs to all parts of the table.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createTable(config) {
    let table = document.createElement("table");
    table.id = config.tableIds.tableElementId;

    let thead = document.createElement("thead");
    thead.id = config.tableIds.theadElementId;

    let tbody = document.createElement("tbody");
    tbody.id = config.tableIds.tbodyElementId;

    table.appendChild(tbody);
    document.getElementById(config.tableIds.tableDivId).appendChild(table);
    document.getElementById(config.tableIds.wrapperDivId).appendChild(document.getElementById(config.tableIds.tableDivId))

    addRows(config, config.numRows, 0)
    addMultipleColumns(config, config.numColumns, 0);
    deleteColumns(config, config.numColumns);
}

function createColumnEntryBox() {
    /**
     * Creates the HTML element that will allow the user to manually
     * affect the columns
     * TODO: Fill this out
     */
}

function onColumnEntryBoxEnter(event, boxValue) {
    /**
     * Updates number of columns at user request
     * TODO: Fill this out
     */
}


/**
 * Adds columns to the table.
 * @param {object} config       - Table configuration object
 * @param {Number} numberOfColumns - Number of columns to be added
 * @returns {undefined}         - Doesn't return anything
 */
function addMultipleColumns(config, numberOfColumns) {
    for(let i = 0; i < numberOfColumns; i++){
        addSingleColumn(config, i);
    }
}

/**
 * Adds a single colunm to the table
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function addSingleColumn(config){ 
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = table.rows.length; // get length row right now
    let numCols = table.rows[0].cells.length;
    for(let i = 0; i < numRows; i++){
        if(i == 0){  // head 
            let newCol = table.rows[i].insertCell(-1);
            newCol.innerHTML = config.columnsName + (numCols + 1);
        }
        else{
            let txtPanel = document.createElement("input");
            txtPanel.setAttribute('type', 'text');
            txtPanel.placeholder = "Value";
            let newCol = table.rows[i].insertCell(-1);
            newCol.appendChild(txtPanel);
        }
    }
}

/**
 * Deletes multiple Columns from an existing table
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
 * Deletes a single Column from an existing table (detle from the bottom of the table)
 *
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleColumn(config) {
     let table = document.getElementById(config.tableIds.tableElementId);
     let numRows = table.rows.length; // get length row right now
    for (var i = 0; i < numRows; i++){
        table.rows[i].deleteCell(-1);
    }
}

function createRowEntryBox() {
    /**
     * Creates the HTML element that will allow the user to manually
     * affect the rows
     * TODO: Fill this out
     * TODO: What other methods will this need?
     */
}

/**
 * Adds rows to the table.
 * @param {object} config       - Table configuration object
 * @param {Number} numberOfRows - Number of rows to be added
 * @param {Number} index        - Vertical index where to start adding rows
 * @returns {undefined}         - Doesn't return anything
 */
function addRows(config, numberOfRows, index) {
    // For each of the newly requested rows
    for (let newRow = 0; newRow < numberOfRows; newRow++) {
        addSingleRow(config, index + newRow)
    }
}

/**
 * Adds a single row to the table
 * @param {object} config   - Table configuration object
 * @param {Number} rowIndex - Where to insert the row
 * @returns {undefined}     - Doesn't return anything
 */
function addSingleRow(config, rowIndex) {
    // Insert a row into the body of the table
    let row = document.getElementById(config.tableIds.tbodyElementId).insertRow(rowIndex);
    // Then for each column
    for (let colIndex = 0; colIndex < config.numColumns; colIndex++) {
        // Create an entry cell
        createEntryCell(config, row, rowIndex, colIndex)
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
    /**
     * TODO: Set this up to deal with default fields
     */

    let cell = row.insertCell(colIndex);
    cell.id = cellIndexToElementId(config.wrapperDivId, rowIndex, colIndex)

    let top = document.createTextNode("---------");
    let br1 = document.createElement("br");
    let middle = document.createTextNode("| (" + rowIndex + ", " + colIndex + ") |");
    let br2 = document.createElement("br");
    let bottom = document.createTextNode("---------");

    cell.appendChild(top);
    cell.appendChild(br1);
    cell.appendChild(middle);
    cell.appendChild(br2);
    cell.appendChild(bottom);
}

/**
 * Creates a magic string for a cell
 * @param {object} wrapperDivId - ID for the wrapper
 * @param {Number} rowIndex     - The row index for a cell
 * @param {Number} colIndex     - The column index for a cell
 * @returns {string}            - Returns a magic string unique to a cell, based on location
 */
function cellIndexToElementId(wrapperDivId, rowIndex, colIndex) {
    return wrapperDivId + "row_" + rowIndex + "_and_col_" + colIndex + "_";
}

function deleteRows(numberOfRows, index) {
    /**
     * Deletes row from existing table. Maybe should also
     * accept index as an argument?
     * TODO: Fill this out
     */
}


/**
 * This function takes the id of the list container for the candidates names
 * It then adds to the list another space for another candidate at the bottom of the list
 * @param wrapperDivId id of the list container
 */
function addRow(wrapperDivId) {
    let container = document.getElementById(wrapperDivId);
    let child = document.createElement("DIV");
    /** TODO: replace candidate's name below with config.Rowname */
    child.innerHTML = 'Enter candidate\'s name'
    container.appendChild(child);
}

/**
 * This function enables the user to enter the name of the candidate,
 * When the container with the id is clicked, an input field is created that enables the user
 * to input the name of the candidate.
 * If the user focuses out of the input field, the name is updated appropriately, and the
 * input element removed
 * @param wrapperDivId the id of the container
 */
function enterRowValue(wrapperDivId) {
    let div = document.getElementById(wrapperDivId);
    let input = document.createElement("INPUT");
    input.type = 'text';
    /** TODO: replace candidate's name below with config.Rowname */
    input.placeholder = "Enter candidate's name";
    div.innerHTML.innerHTML = input;
    input.focusout = function () {
        let value = input.value.trim();
        if (value !== '') {
            div.innerHTML = input;
        }
    }
}

function deleteSingleRow(index) {
    /**
     * Deletes single row from existing table. Maybe should also accept index as an argument?
     * TODO: Fill this out
     */

}

function toJSON() {
    /**
     * Parses data held in HTML to JSON and sends it to client
     * TODO: Fill this out
     */
}

function getFieldId(row, col, fieldName) {
    /**
     * Transforms arguments into a magic string for accessing HTML
     * TODO: Fill this out
     */
}

function getCellId(row, col) {
    /**
     * Transforms arguments into a magic string for accessing HTML
     * TODO: Fill this out
     */
}

function showHelpTooltip(event) {
    /**
     * Uses the data-label attribute and converts it to a tooltip
     */
    const helpText = event.target.getAttribute('data-label');

    let div = document.createElement('div');
    div.id = 'timeline-info-tooltip';
    div.innerHTML = helpText;
    div.style.position = 'fixed';
    div.style.left = (event.clientX+5) + 'px';
    div.style.top = (event.clientY-30) + 'px';

    // To ensure tooltip is never transparent,
    // find the first non-transparent element in the hierarchy and add it there
    const firstNonTransparentElement = event.target.parentElement.parentElement.parentElement;
    firstNonTransparentElement.appendChild(div);
}

function hideHelpTooltip() {
    /**
     * Hides the tooltip created by showHelpTooltip
     */
    document.getElementById('timeline-info-tooltip').remove();
}

/**
 * Public functions below
 */

/**
 * Function available to client in order to create a datatable
 * @param {object} clientConfig - Client configuration requests
 */
// eslint-disable-next-line no-unused-vars,camelcase
function dt_CreateDataTable(clientConfig) {
    /**
     * Creates the HTML data table
     * TODO: Finish filling this out
     */
    setConfig(clientConfig);

    createSubDivs(configDict[clientConfig.wrapperDivId]);

    createTable(configDict[clientConfig.wrapperDivId]);

    addSingleColumn(configDict[clientConfig.wrapperDivId]);
    deleteSingleRow(configDict[clientConfig.wrapperDivId]);
}

function dt_disableField(row, col, fieldName) {
    /**
     * Calls getFieldId() then disables a specific field in a specific cell
     * TODO: Fill this out
     */
}

function dt_enableField(row, col, fieldName) {
    /**
     * Calls getFieldId() then enables a specific field in a specific cell
     * TODO: Fill this out
     */
}

function dt_disableCell(row, col) {
    /**
     * Calls getCellId() then disables all fields of a specific cell
     * TODO: Fill this out
     */
}

function dt_enableCell(row, col) {
    /**
     * Calls getCellId() then enables all fields of a specific cell
     * TODO: Fill this out
     */
}

function dt_setFieldValue(row, col, fieldName, value) {
    /**
     * Calls getFieldId() then updates a specific field in a
     * specific cell to a given value
     * TODO: Fill this out
     */
}

function dt_getFieldValue(row, col, fieldName, value) {
    /**
     * Calls getFieldId() then retrieves a value from
     * a specific field in a specific cell
     * TODO: Fill this out
     */
}


// In case of node.js
/* eslint no-undef: ["off"] */
if (typeof exports !== typeof undefined) {
    exports.createDataTable = dt_createDataTable;
}
