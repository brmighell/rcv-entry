/*
 * Global vars - storing data for callbacks
 */

/**
 * Global variable containing configuration information for the table
 * @property {string} wrapperDivId          - ID for the wrapper
 * @property {number} numRows               - Number of rows in the table
 * @property {number} numColumns            - Number of columns in the table
 * @property {object} cellFieldNames        - Array of the names for all fields in a cell
 * @property {object} cellFieldTypes        - Array of the types for all fields in a cell
 * @property {object} cellFieldDefaults     - Array of the defaults for all fields in a cell
 * @property {object} cellFieldCallbacks    - Array of the callbacks for all fields in a cell
 */
// let config = null;

/**
 * @property {string} wrapperDivId      - ID for the div passed in by the client
 * @property {string} tableDivId        - ID for the div containing the table
 * @property {string} entryBoxDivId     - ID for the div containing the entry box
 * @property {string} tableElementId    - Id for the entire table element
 * @property {string} theadElementId    - ID for the table's first row (column headers) element
 * @property {string} tbodyElementId    - ID for the table's body element
 * @type {null}
 */
// let tableIds = null;

/**
 * @property {object} Names     - Array of the names for all fields in a cell
 * @property {object} Types     - Array of the types for all fields in a cell
 * @property {object} Defaults  - Array of the defaults for all fields in a cell
 * @property {object} Callbacks - Tells what function, if any, to execute when a field is changed
 * @type {null}
 */
// let datumConfig = null;

/* Collection of eventTypes
* TODO: Figure out why lint doesn't like ENUMs */
// enum eventTypes = {};

/**
 * Functions for table creation
 */

/**
 * Creates a unique table div ID given the wrapper div ID
 * @param {string} wrapper ID for the wrapper of the table
 * @returns {object} Returns object containing useful IDs
 */
function convertWrapperDivIdToTableIds(wrapper) {
    let tableIds = {
        wrapperDivId: wrapper,
        tableDivId: '_tableDivId_' + wrapper,
        entryBoxDivId: '_entryBoxDivId_' + wrapper,
        tableElementId: '_tableId_' + wrapper,
        theadElementId: '_theadId_' + wrapper,
        tbodyElementId: '_tbodyId_' + wrapper
    }

    return tableIds;
}

function createDatumConfig() {
    let datumConfig = {
        Names: ["Votes", "Status"],
        Types: [Number, []],
        Values: [0, ["Active", "Elected", "Eliminated"]],
        Callbacks: []
    }

    return datumConfig;
}

/**
 * If any option is not provided, chooses a sane default
 * @param {object} clientConfig A set of overriding config values, edits in-place
 * @throws Error if any required option is not provided
 * @returns {object} Returns config information
 */
function setConfigDefaults(clientConfig) {

    let config = {
        numRows: 3,
        numColumns: 3,
        tableIds: null,
        datumConfig: null
    };

    if (clientConfig.wrapperDivId === undefined) {
        throw new Error("An ID for the wrapper div is required");
    }

    config.tableIds = convertWrapperDivIdToTableIds(clientConfig.id);

    if (clientConfig.numRows !== undefined) {
        config.numRows = clientConfig.numRows;
    }

    if (clientConfig.numColumns !== undefined) {
        config.numColumns = clientConfig.numColumns;
    }

    config.datumConfig = createDatumConfig();

    if (clientConfig.cellFieldNames !== undefined) {
        config.datumConfig.Names = ["Votes", "Status"];
    }

    if (clientConfig.cellFieldTypes !== undefined) {
        config.datumConfig.Types = [Number, []];
    }

    if (clientConfig.cellFieldDefaults !== undefined) {
        config.datumConfig.Values = [0, ["Active", "Elected", "Eliminated"]];
    }

    if (clientConfig.cellFieldCallbacks !== undefined) {
        config.datumConfig.Callbacks = [];
    }

    validateConfig(config);

    return config;
}

/**
 * Performs basic logic-checking on the config after defaults have been set
 * @param {object} config configuration file
 * @throws Error if any of the components don't make sense
 * @returns {undefined} Returns absolutely nothing
 */
function validateConfig(config) {

    if (config.numColumns <= 0 || config.numRows <= 0) {
        throw new Error("The table must have at least one column and one row!")
    }
}

function createEntryCell(indexString) {
    /**
     * Accesses the config to figure out what to make, then creates
     * a cell at the specified spot in the HTML
     * TODO: Fill this out
     */
}

function cellIndexToElementId(rowIndex, colIndex) {
    return "_row_" + rowIndex + "_and_col_" + colIndex + "_";
}

function createSubDivs(config) {
    let entryBoxDiv = document.createElement("div");
    entryBoxDiv.id = config.tableIds.entryBoxDivId;

    let tableDiv = document.createElement("div");
    tableDiv.id = config.tableIds.tableDivId;

    // FIX: Delete this!
    let text = document.createTextNode("~~This is where the entry box will live~~");
    entryBoxDiv.appendChild(text);

    document.getElementById(config.tableIds.wrapperDivId).appendChild(entryBoxDiv);
    document.getElementById(config.tableIds.wrapperDivId).appendChild(tableDiv);
}

/**
 * Creates an HTML table.
 * Assigns unique element IDs to all parts of the table.
 * @returns {undefined} Returns absolutely nothing
 */
function createTable(config) {
    let table = document.createElement("table");
    table.id = config.tableIds.tableElementId;

    let thead = document.createElement("thead");
    thead.id = config.tableIds.theadElementId;

    let tbody = document.createElement("tbody");
    tbody.id = config.tableIds.tbodyElementId;

    addRows(config, config.numRows, 0)

    table.appendChild(tbody);
    document.getElementById(config.tableIds.tableDivId).appendChild(table);
    document.getElementById(config.tableIds.wrapperDivId).appendChild(document.getElementById(config.tableIds.tableDivId))
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

function addColumns(numberOfColumns, index) {
    /**
     * Adds columns from existing table. Will probably call
     * createEntryCell(). Maybe should also accept index as an argument?
     * TODO: Fill this out
     */
}

function addSingleColumn(index) {
    /**
     * Adds single column from existing table. Will probably call
     * createEntryCell(). Maybe should also accept index as an argument?
     * TODO: Fill this out
     */
}

function deleteColumns(numberOfColumns, index) {
    /**
     * Deletes columns from existing table. Maybe should also
     * accept index as an argument?
     * TODO: Fill this out
     */
}

function deleteSingleColumn(index) {
    /**
     * Deletes single column from existing table. Maybe should also accept index as an argument?
     * TODO: Fill this out
     */
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
 * @param {Number} numberOfRows Number of rows to be added
 * @param {Number} index Vertical index where to start adding rows
 * @returns {undefined} Doesn't return anything
 */
function addRows(config, numberOfRows, index) {
    // For each of the newly requested rows
    for (let newRow = 0; newRow < numberOfRows; newRow++) {
        // Insert a row into the body of the table
        let row = document.getElementById(config.tableIds.tbodyElementId).insertRow(index + newRow);
        // Then create a cell for each column
        for (let colIndex = 0; colIndex < config.numColumns; colIndex++) {
            let cell = row.insertCell(colIndex);
            let indexString = cellIndexToElementId(index + newRow, colIndex)
            let text = document.createTextNode(indexString);
            cell.appendChild(text);
        }
    }
}

function addSingleRow(index) {
    /**
     * Adds single row from existing table. Will probably call
     * createEntryCell(). Maybe should also accept index as an argument?
     * TODO: Fill this out
     */
}

function deleteRows(numberOfRows, index) {
    /**
     * Deletes row from existing table. Maybe should also
     * accept index as an argument?
     * TODO: Fill this out
     */
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

// eslint-disable-next-line no-unused-vars,camelcase
function dt_CreateDataTable(clientConfig) {
    /**
     * Creates the HTML data table
     * TODO: Finish filling this out
     * TODO: Transfer code to appropriate functions
     * TODO: Make sure this works
     */

    let config = setConfigDefaults(clientConfig);

    createSubDivs(config);

    createTable(config);

    let element = document.getElementById(clientConfig.wrapperDivId);
    element.innerHTML += "This is a test";
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
// if (typeof exports !== typeof undefined) {
//     exports.createDataTable = dt_createDataTable;
// }
