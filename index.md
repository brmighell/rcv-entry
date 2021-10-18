---
layout: default
---
{% capture deps %}{% include_relative docs/deps.html %}{% endcapture %}
{{ deps }}

# A lightweight, dependency-free range slider

The default configuration gives you a slider with a collapsible timeline:
{% capture ex0 %}{% include_relative docs/example-0-teaser.html %}{% endcapture %}
{{ ex0 }}

## Features & Benefits
Features:
* A mobile-friendly range slider,
* With a collapsible events timeline to list events which occurred at each index in the slider,
* With tooltips for deeper explanations of the summaries

Benefits:
* Vanilla Javascript & CSS
* No external libraries: no jQuery, bootstrap, Sass, etc
* Simple javascript configuration with sane defaults
* Simple, easy-to-override CSS
* Permissive license

## Examples
### #1: Default
{% capture ex1 %}{% include_relative docs/basic-example.html %}{% endcapture %}
{{ ex1 }}

### #2: Dark theme
{% capture ex2 %}{% include_relative docs/example-2-darkmode.html %}{% endcapture %}
{{ ex2 }}

### #3: Small and continuous
{% capture ex3 %}{% include_relative docs/example-3-small.html %}{% endcapture %}
{{ ex3 }}

### #4: Variable tick text
{% capture ex4 %}{% include_relative docs/example-4-custom-tick-text.html %}{% endcapture %}
{{ ex4 }}
