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
     * @property {Array}  rowNames      - Initial list of row names
     */
    constructor(clientConfig) {
        this.numRows = clientConfig.numRows === undefined ? 3 : clientConfig.numRows;
        /* numColumns also accounts for row names - assumes that the user is asking for:
           "this many columns plus one column for row names" */
        this.numColumns = clientConfig.numColumns === undefined ? 4 : clientConfig.numColumns + 1;
        this.rowsName = clientConfig.rowsName === undefined ? "Row" : clientConfig.rowsName;
        this.columnsName = clientConfig.columnsName === undefined ? "Column" : clientConfig.columnsName;
        this.rowNames = clientConfig.rowNames === undefined ? ["1", "2", "3"] : clientConfig.rowNames;
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
            rowInputId: '_rowInputId_' + clientConfig.wrapperDivId,
            nameInputId: '_nameInputId_' + clientConfig.wrapperDivId
        }

        /**
         * @property {object} names     - Array of the names for all fields in a cell | Default: ["Value"]
         * @property {object} types     - Array of the types for all fields in a cell | Default: [Number]
         * @property {object} defaults  - Array of the defaults for all fields in a cell | Default: [0]
         * @property {object} callbacks - Tells what function to execute when a field is changed | Default: ["None"]
         */
        this.datumConfig = {
            names: clientConfig.names === undefined ? ["Value: ", ""] : clientConfig.names,
            types: clientConfig.types === undefined ? [Number, Array] : clientConfig.types,
            values: clientConfig.values === undefined ? [0, ["Active", "Inactive"]] : clientConfig.values,
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

/**
 * Creates a header of the column
 * @param {object} config - Table configuration object
 * @returns {undefined}   - Doesn't return anything
 */
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
    removeExistingColumns(config);
    config.numColumns = 1;
    for (let i = 0; i < numberOfColumns; i++) {
        addSingleColumn(config);
    }
}

/**
 * Removes all existing columns, instead of the first one
 * @param {object} config - A set of overriding config values, edits in-place
 * @returns {undefined}         - Doesn't return anything
 */
function removeExistingColumns(config){
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = table.rows.length; // get length row right now
    let numCols = table.rows[0].cells.length;
    for(let i=1; i<numCols; i++){
        let headCellId = "_theadId_wrapper-0row_0_and_col_"+i;
        let cell = document.getElementById(headCellId);
        cell.remove();
    }
    for(let i=0; i<numRows-1; i++){
        for(let j=1; j<numCols; j++){
            let cellId = "wrapper-0row_"+i+"_and_col_"+j;
            let cell = document.getElementById(cellId);
            cell.remove();
        }
    }
}

/**
 * Adds a single column to the table
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function addSingleColumn(config) {
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = table.rows.length; // get length row right now
    let numCols = table.rows[0].cells.length;

    let cell = table.rows[0].insertCell(numCols);
    cell.id = cellIndexToElementId(config.tableIds.theadElementId, 0, numCols);
    cell.classList.add("data-table-cell");

    let middle = document.createTextNode(config.columnsName + " " + numCols);

    cell.appendChild(middle);

    for (let rowIndex = 1; rowIndex < numRows; rowIndex++) {
        createEntryCell(config, table.rows[rowIndex], rowIndex-1, numCols);

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
    for (let i = 0; i < numberOfColumns; i++) {
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
    // Get the table
    let table = document.getElementById(config.tableIds.tableElementId);
    let numRows = table.rows.length; // get length row right now
    // Iterate rows and delete cell
    for (let i = 0; i < numRows; i++) {
        table.rows[i].deleteCell(-1);
    }
    // Update config with new number of columns
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
        addSingleRow(config, index + newRow, config.rowNames[newRow]);
    }
}

/**
 * Adds a single row to the table
 * @param {object} config   - Table configuration object
 * @param {Number} rowIndex - Where to insert the row
 * @param {String} content  - Content to place in the left-most cell of a row (uses default if
 *                              no string is provided)
 * @returns {undefined}     - Doesn't return anything
 */
function addSingleRow(config, rowIndex, content) {
    // Insert a row into the body of the table
    let row = document.getElementById(config.tableIds.tbodyElementId).insertRow(rowIndex);
    row.id = "table-row-"+rowIndex;
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

/**
 * Creates row header
 * @param {object} config - A set of overriding config values, edits in-place
 * @param {object} row - An object that represents datatable row
 * @param {Number} rowIndex - A number that represents index of the row inside the table
 * @param {Number} colIndex - A number that represents index of the column inside the table
 * @param {String} content - A string that represents content for cell
 * @returns {undefined}         - Doesn't return anything
 */
// eslint-disable-next-line max-params
function createRowHeader(config, row, rowIndex, colIndex, content) {

    let cell = row.insertCell(colIndex);
    cell.id = cellIndexToElementId(config.wrapperDivId, rowIndex, colIndex)
    cell.classList.add("data-table-cell");

    if (content) {
        if(isNumber(content))
            content = '';
        cell.innerHTML = content;
    }
}

/**
 * Changes first cell value of table row
 * @param {String} value   -  Value that is being set inside cell
 * @param {Number} index   -  Index of table row that is being updated
 * @returns {undefined} - Doesn't return anything
 */
function changeCellValue(value, index){
    let id = "wrapper-0row_"+index+"_and_col_0";
    let cell = document.getElementById(id);
    // set the value inside cell
    cell.innerHTML = value;
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
        label.innerHTML = String(config.datumConfig.names[fieldNum]);
        label.classList.add('cell-label');
        if (type === Number || type === String) {
            let input = document.createElement("INPUT");
            input.type = 'text';
            input.placeholder = config.datumConfig.values[fieldNum];
            input.classList.add('cell-input');
            if (config.datumConfig.callbacks[fieldNum] !== undefined) {
                input.addEventListener("focusout", function () {
                    /**
                     * FIXME: this is a placeholder implementation of a callback - do we need it?
                     */
                    // config.datumConfig.callbacks[fieldNum];
                })
            }
            label.appendChild(input);

        } else if (type === Boolean) {
            let input = document.createElement("INPUT");
            input.type = 'checkbox';
            input.classList.add('cell-checkbox');
            input.defaultChecked = config.datumConfig.values[fieldNum];
            label.appendChild(input);
        } else if (type === Array) {
            let select = document.createElement("select");
            select.classList.add('cell-dropdown');
            for (let i = 0; i < config.datumConfig.values[fieldNum].length; i++) {
                let option = document.createElement("option");
                option.innerHTML = config.datumConfig.values[fieldNum][i];
                select.appendChild(option);
            }
            label.appendChild(select);
        } else {
             errorText = "Cell field datatype not supported.";
             throw errorText;
        }
        cell.appendChild(label);
    }
}

/**
 * Deletes a single row from an existing table
 *
 * FIXME: This works when deleting from the table. It does support deleting from the middle!
 *
 * @param {object} config   - Table configuration object
 * @param {Number} rowIndex - Index of the row to be deleted
 * @returns {undefined}     - Doesn't return anything
 */
function deleteSingleRow(config, rowIndex) {
    document.getElementById(config.tableIds.tbodyElementId).deleteRow(rowIndex);
}


/**
 * Creates a magic string for a cell
 * @param {object} wrapperDivId - ID for the wrapper
 * @param {Number} rowIndex     - The row index for a cell
 * @param {Number} colIndex     - The column index for a cell
 * @returns {string}            - Returns a magic string unique to a cell, based on location
 */
function cellIndexToElementId(wrapperDivId, rowIndex, colIndex) {
    return wrapperDivId + "row_" + rowIndex + "_and_col_" + colIndex;
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
    input.addEventListener("keyup", function (event) {
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
            // add values to drop
        } else {
            addSingleColumn(config);
        }
        input.value = '';
    }
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
}

/**
 * Creates HTML elements by which the user can easily create rows with custom left-most cells.
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createRowEntryBox(config) {
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
    input.placeholder = config.rowNames.length;
    input.classList.add('enter-row-name');

    // If the user hits enter while in the text box, click the addRowBtn
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        /**
         * FIXME: This might cause an error for mobile users. Potentially there's a better way than waiting for "enter"?
         */
        if (event.code === "Enter") {
            let wrapperDiv = document.getElementById("custom-entries");
            addRowDrop(config, input, wrapperDiv);
        }
    })
    entryBoxDiv.appendChild(input);


    let entriesDiv = document.createElement("div");
    entriesDiv.id = "custom-entries";
    entryBoxDiv.appendChild(entriesDiv);

    // Creates the button that will take the user input and send it to addSingleRow() when clicked
    let addRowBtn = document.createElement("button");
    addRowBtn.type = "button";
    addRowBtn.innerHTML = "+ Add a " + config.rowsName.toLowerCase() + " to the bottom";
    addRowBtn.classList.add("add-row-button");
    addRowBtn.onclick = function () {
        let value = input.value.trim();
        if (value !== '') {
            // add to dropdown
            let opt = document.createElement('option');
            opt.value = value;
            opt.innerHTML = value;
            select = document.getElementById(config.entryIds.nameInputId);
            select.appendChild(opt);

            addSingleRow(config, config.numRows, value);
        } else {
            addSingleRow(config, config.numRows);
        }
        input.value = '';
    }

    let inputName = document.createElement("SELECT");
    inputName.id = config.entryIds.nameInputId;

    let deleteRowByNameBtn = document.createElement("button");
    deleteRowByNameBtn.type = "button";
    deleteRowByNameBtn.innerHTML = "Delete selected row";
    deleteRowByNameBtn.classList.add("add-row-button")
    deleteRowByNameBtn.onclick = function () {
        let name = inputName.value.trim();
        // find index of name in rows
        const cells = document.querySelectorAll('td');
        cells.forEach((cell) => {
            if(cell.innerText === name){
                deleteSingleRow(config, cell.closest('tr').rowIndex-1);
            }
        });

        inputName.remove(inputName.selectedIndex)

    }

    // If the user hits enter while in the text box, click the addRowBtn
    inputName.addEventListener("keyup", function (event) {
        event.preventDefault();
        /**
         * FIXME: This might cause an error for mobile users. Potentially there's a better way than waiting for "enter"?
         */
        if (event.code === "Enter") {
            deleteRowByNameBtn.click();
        }
    })
}

/**
 * Creates a button that will call deleteSingleRow().
 * @param {object} config   - Table configuration object
 * @returns {undefined}     - Doesn't return anything
 */
function createRowDeleteBtn(config) {
    let deleteRowBtn = document.createElement("button");
    deleteRowBtn.type = "button";
    deleteRowBtn.onclick = function () {
        deleteSingleRow(config, config.numRows - 1);
    }
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
 * This function sets up the list of items already in the list
 * @param {object} config - config
 * @returns {undefined} - Doesn't return anything
 */
function createListItems(config){

    let wrapperDiv = document.getElementById("custom-entries");

    for (let i = 0; i < config.rowNames.length; i++){
        addTableEntryItems(config.rowNames[i], 'delete_x.png', wrapperDiv, config);
    }

    addAddNextItem("Add a row", wrapperDiv, config);

}


/**
 * Adds elements inside table cells
 * @param {string} name - name of row
 * @param {string} icon - icon to be displayed next to it
 * @param {object} wrapperDiv - div
 * @param {object} config - config
 * @param {string} inputValue - the input
 * @returns {undefined} - Doesn't return anything
 */
// eslint-disable-next-line max-params
function addTableEntryItems(name, icon, wrapperDiv, config, inputValue){

    let individualDiv = document.createElement("div");
    individualDiv.id = name;
    individualDiv.classList.add("menu");

    let leftMenu = document.createElement("div");
    leftMenu.classList.add("containerX");

    let input = document.createElement("INPUT");
    input.type = 'text';
    input.placeholder = "Enter row name...";
    input.classList.add('entry-input');
    if(inputValue)
        input.value = inputValue;
    let rowIndex = parseInt(name, 10) - 1;
    input.onchange = function() {
        changeCellValue(input.value, rowIndex);
    };
    input.onkeypress = function() {
        changeCellValue(input.value, rowIndex);
    };
    input.onpaste = function() {
        changeCellValue(input.value, rowIndex);
    };
    input.oninput = function() {
        changeCellValue(input.value, rowIndex);
    };

    leftMenu.appendChild(input);

    let deleteImg = document.createElement("img");
    deleteImg.src = "delete_x.png";
    deleteImg.classList.add("delete-item");
    deleteImg.style.width = "10%";

    leftMenu.appendChild(deleteImg);
    individualDiv.appendChild(leftMenu);

    deleteImg.addEventListener("click", () => {

        deleteRowDrop(name, config);

    });

    wrapperDiv.appendChild(individualDiv);

}


/**
 * Adds the next item
 * @param {string} name - name of new item
 * @param {object} wrapperDiv - div
 * @param {object} config - config
 * @return {undefined} - Doesn't return anything
 */
function addAddNextItem(name, wrapperDiv, config){

    let individualDiv = document.createElement("div");
    individualDiv.id = "add-participant-id";


    let leftMenu = document.createElement("div");
    leftMenu.classList.add("containerX");

    let text = document.createElement("p");
    text.innerHTML = name;

    leftMenu.appendChild(text);

    let addImg = document.createElement("img");
    addImg.src = "ic_add.png";
    addImg.classList.add("add-item");

    text.appendChild(addImg);
    individualDiv.appendChild(leftMenu);


    addImg.addEventListener("click", () => {
        let input = document.getElementById(config.entryIds.rowInputId);
        addRowDrop(config, input, wrapperDiv, true);
    });
    wrapperDiv.appendChild(individualDiv);
}

/**
 * move the add a row button to the bottom
 * @return {undefined} - Doesn't return nothing
 */
function refreshItemList(){
    let addSection = document.getElementById("add-participant-id");
    addSection.remove();
}

/**
 * Deletes table row
 * @param {string} inputName - value of row
 * @param {object} config - config
 * @return {undefined} Doesn't return nothing
 */
function deleteRowDrop(inputName, config){
    let nameInt = parseInt(inputName, 10);
    let indexRow = nameInt - 1;
    let id = "table-row-"+indexRow;
    let rowElement = document.getElementById(id);
    rowElement.remove();
    document.getElementById(inputName).remove();
    document.getElementById("_rowInputId_wrapper-0").value = document.getElementsByClassName("menu").length;
    for(let i=nameInt; i<config.numRows; i++){
        let newIndex = i-1;
        id = "table-row-"+i;
        rowElement = document.getElementById(id);
        rowElement.id = "table-row-"+newIndex;
        for(let j=0; j<config.numColumns; j++){
            id = "wrapper-0row_"+i+"_and_col_"+j;
            let cell = document.getElementById(id);
            id = "wrapper-0row_"+newIndex+"_and_col_"+j;
            cell.id = id;
        }
    }
    config.numRows -= 1;
}


/**
 * Adds row to the table
 * @param {object} config config
 * @param {string} input input value for candidate name
 * @param {object} wrapperDiv div
 * @param {object} addNewClickEvent - the new event
 * @return {undefined} - Doesn't return nothing
 */
function addRowDrop(config, input, wrapperDiv, addNewClickEvent){
    let value = input.value.trim();

    if (value !== '') {
        let menuInputs = document.getElementsByClassName("entry-input");
        let menuInputsValues = []
        for(let menuInput of menuInputs){
            menuInputsValues.push(menuInput.value);
        }

        refreshItemList();

        if(isNumber(value)){
            if(addNewClickEvent){
                value = parseInt(value, 10) + 1;
            }
            deleteAllRows(config, 0);
            for (let i = 0; i < value; i++){
                addTableEntryItems(String(config.numRows + 1), 'delete_x.png', wrapperDiv, config, menuInputsValues[i]);
                addSingleRow(config, config.numRows, menuInputsValues[i]);
            }
        }else{
            addTableEntryItems(value, 'delete_x.png', wrapperDiv, config);
            addSingleRow(config, config.numRows, value);
        }
        addAddNextItem("Add a row", wrapperDiv, config);
    } else {
        refreshItemList();
        addTableEntryItems(String(config.numRows + 1), 'delete_x.png', wrapperDiv, config);
        addSingleRow(config, config.numRows, String(config.numRows + 1));
        addAddNextItem("Add a row", wrapperDiv, config);
    }

    updateHint(config);
}

/**
 * Check if passed value is a Number
 * @param {string} value - value in the  input field
 * @returns {boolean} - true if Number, false if not a Number object
 */
function isNumber(value){
    // eslint-disable-next-line require-unicode-regexp
    return (/\d/).test(value);
}

/**
 * Update hint function
 * @param {object} config - the config
 * @returns {undefined} - Doesn't return anything
 */
function updateHint(config){

    let input = document.getElementById(config.entryIds.rowInputId);
    input.placeholder = config.numRows;
}

/**
 * Delete all rows
 * @param {object} config - the config
 * @param {number} index - the index
 * @returns {undefined} - Doesn't return anything
 */
function deleteAllRows(config, index) {

    for (let i = 0; i < config.numRows; i++){
        document.getElementById(config.tableIds.tbodyElementId).deleteRow(index);
        config.numRows -= 1;
        deleteAllRows(config, index);
    }

    document.getElementById("custom-entries").innerHTML = '';


}


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

    createEntryBox(configDict[clientConfig.wrapperDivId]);

    createListItems(configDict[clientConfig.wrapperDivId]);


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
