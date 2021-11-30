
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

Create a table by calling:
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
| `canEditRowHeader` <br/><br/> default: `true` | Make the row headers an input field? |
| `canEditColumnHeader` <br/><br/> default: `false` | Make the column headers an input field? |
| `names` <br/><br/> default: `["Value", "Status"] ` | Array of the names for all fields in a cell. |
| `types` <br/><br/> default: `[Number, Array]` | Array of the types for all fields in a cell. |
| `values` <br/><br/> default: `[0, ["Active", "Inactive"]]` | Array of the types for all fields in a cell. |
| `callbacks` <br/><br/> default: `"None"` | Tells what function to execute when a field is changed. |

## CSS configuration
All CSS styles begin with `dt_` and can be overridden with your own custom CSS.
See [data-table/table.css](data-table/table.css) for some of the options that may be overridden.
Additional, unstyled classes are also set on several elements, though these are undocumented.
