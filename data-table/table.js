/*
 * Global vars - storing data for callbacks
 */

/* Stores config data passed in from client */
let config = null;

/* Collection of eventTypes
* TODO: Figure out why lint doesn't like ENUMs */
// enum eventTypes = {};

/**
 * Functions for table creation
 */

function convertWrapperDivIdToTableDivId(wrapperDivId) {
    /**
     * Creates a unique table div ID given the wrapper div ID
     */
    return '_tableDiv_' + wrapperDivId;
}

function setConfigDefaults(clientConfig) {
    /**
     * If any option is not provided, chooses a sane default
     * @param options A set of overriding config values, edits in-place
     * @throws Error if any required option is not provided
     */
}

function validateConfig(clientConfig) {
    /**
     * Performs any necessary logic checks on the configuration
     * TODO: Fill this out
     */
}

function createEntryCell(indexString) {
    /**
     * Accesses the config to figure out what to make, then creates
     * a cell at the specified spot in the HTML
     * TODO: Fill this out
     */
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

function addColumn(numberOfColumns) {
    /**
     * Adds columns from existing table. Will probably call
     * createEntryCell(). Maybe should also accept index as an argument?
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

function deleteColumn(numberOfColumns) {
    /**
     * Deletes columns from existing table. Maybe should also
     * accept index as an argument?
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

function dt_createDataTable(config) {
    /**
     * Creates the HTML data table
     * TODO: Fill this out
     */

    document.getElementById(config.id).textContent = "Hello world";
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
