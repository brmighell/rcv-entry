# Run this as a pre-commit script.
# Will be a no-op unless docs have changed.
#
# Takes readme-generator.md and creates:
#    1. A jekyll-ready markdown file with includes for dynamic github pages
#    2. A github-ready markdown file with images for static pages

import os
import sys


def initialize_dynamic_lines():
    return [
        '---\n',
        'layout: default\n',
        '---\n'
    ]


def initialize_static_lines():
    return [
        '# A lightweight HTML+JS library for inputting two-dimensional form data\n\n',
        'See this project at [https://brmighell.github.io/rcv-entry/]\n\n',
        '[![Coverage Status](https://coveralls.io/repos/github/brmighell/rcv-entry/badge.svg?branch=main)](https://coveralls.io/github/brmighell/rcv-entry?branch=main)',
    ]


def isFileDataEqual(filename, expectedlines):
    # Is expectedlines equal to filename?
    with open(filename, 'r') as f:
        lines = f.readlines()
    return lines == expectedlines


def create_derived_files(input_filename, output_static_filename, output_dynamic_filename):
    # Map from a magic key to a triple:
    #    1. variable name (just a helper - must match the key)
    #    2. What file to include in the dynamic file?
    #    3. What file to include in the static file?
    magic_keys = {
        '{{ deps }}\n': ('deps', 'docs/deps.html', None),
        '{{ ex0 }}\n':  ('ex0', 'docs/github-pages-example-0.html', None),
        '{{ ex1 }}\n':  ('ex1', 'docs/github-pages-example-1.html', None),
        '{{ ex2 }}\n':  ('ex2', 'docs/github-pages-example-2.html', None),
        '{{ ex3 }}\n':  ('ex3', 'docs/github-pages-example-3.html', None),
    }

    # Small enough to just read it all into memory,
    # why complicate things?
    with open(input_filename, 'r') as f:
        lines = f.readlines()

    static_lines = initialize_static_lines()
    dynamic_lines = initialize_dynamic_lines()
    for line in lines:
        if line not in magic_keys:
            static_lines.append(line)
            dynamic_lines.append(line)
            continue

        # Magic keyword found. Do magic for static or dynamic
        (key, dynamic_content, static_content) = magic_keys[line]
        if static_content is not None:
            # Replace the static content
            static_lines.append(f'\n[\[interactive demo\]](https://brmighell.github.io/rcv-entry/)\n')
            static_lines.append(f'![{key}]({static_content})\n')

        # Include the actual content + the dynamic content
        include_line = '{% capture ' + key + ' %}'
        include_line += '{% include_relative ' + dynamic_content + ' %}'
        include_line += '{% endcapture %}\n'
        dynamic_lines.append(include_line)
        dynamic_lines.append(line)

    # Safety check: don't overwrite accidental changes
    stream = os.popen('git diff --name-only')
    diffs = stream.read()

    # Make sure we didn't accidentally change README.md or index.md
    if output_dynamic_filename in diffs:
        if not isFileDataEqual(output_dynamic_filename, dynamic_lines):
            print(
                f"File {output_dynamic_filename} is dirty. Refusing to overwrite.")
            sys.exit(-1)
    if output_static_filename in diffs:
        if not isFileDataEqual(output_static_filename, static_lines):
            print(
                f"File {output_static_filename} is dirty. Refusing to overwrite.")
            sys.exit(-1)

    # Finally, write it all
    with open(output_static_filename, 'w') as f:
        f.write(''.join(static_lines))
    with open(output_dynamic_filename, 'w') as f:
        f.write(''.join(dynamic_lines))


create_derived_files('docs/readme-generator.md', 'README.md', 'index.md')
