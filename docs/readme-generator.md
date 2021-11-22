
{{ deps }}

# A lightweight, extendable, dependency-free javascript HTML table plugin

The default configuration:
{{ ex0 }}

## Features & Benefits
Features:
* Customisable labels
* Customisable layout
* Customise column rendering
* Has option to disable any input type for any cell
* Has option to change values for any input type at any cell
* Callback informs RCVis of the updates

Benefits:
* Vanilla Javascript & CSS
* No external libraries: no jQuery, bootstrap, Sass, etc
* Simple javascript configuration with sane defaults
* Simple, easy-to-override CSS
* Permissive license

## Examples
### #1: Default
{{ ex1 }}

### #2: Fruit Example
{{ ex2 }}

### Usage
#### API: Vanilla Javascript
If you're not using node.js, functions begin with dt namespace to avoid conflicts:

Include the files in your HTML and create a wrapper div:
```html
<link rel="stylesheet" href="table.css">
<script type="text/javascript" src="table.js"></script>
<div id="table"></div>
```

Create a slider by calling:
```javascript
const config = {wrapperDivId: 'div'}
dtCreateDataTable(config);
```

additional config options are described below.

### Configuration options
The `config` dictionary has the following options:

| key/default | description |
| --- | --- |
| `wrapperDivId`\* <br/><br/> _required_ | The div id in which to create the data table. |
| `numRows` <br/><br/> default: `3` | Number of rows in the table. |
| `numColumns` <br/><br/> default: `4` | Number of columns in the table. |
| `rowsName` <br/><br/> default: `Row` | Name of rows in the table. |
| `columnsName` <br/><br/> default: `Column` | Name of columns in the table. |
| `tableIds` <br/><br/> default: `Container` | Container for all the table's magic strings. |
| `datumConfig` <br/><br/> default: `Container` | Container for default values of a cell. |
| `tableDivId` <br/><br/> default: `'_tableDivId_'` | ID for the div containing the table. |
| `entryBoxDivId` <br/><br/> default: `'_entryBoxDivId_'` | ID for the div containing the entry box. |
| `tableElementId` <br/><br/> default: `'_tableId_'` | Id for the entire table element. |
| `theadElementId ` <br/><br/> default: `'_theadId_'` | ID for the table's first row (column headers) element. |
| `tbodyElementId` <br/><br/> default: `'_tbodyId_'` | ID for the table's body element. |
| `names` <br/><br/> default: `"Value"` | Array of the names for all fields in a cell. |
| `types` <br/><br/> default: `Number` | Array of the types for all fields in a cell. |
| `defaults` <br/><br/> default: `0` | Array of the defaults for all fields in a cell. |
| `callbacks` <br/><br/> default: `"None"` | Tells what function to execute when a field is changed. |
