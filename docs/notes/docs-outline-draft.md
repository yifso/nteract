# Structure

- Home
    - About nteract
        - Basic terms
            - 
        - Developer terms
            - 
- Guides
    - Getting started
        - Installation
        - Notebooks
            - Create new
            - Actions in interactive notebooks
                - Write code
                - Write documentation
    - Creating Visualizations
        - Which visualization to use
            - Matplotlib
            - Seaborn
            - Plotly
        - Exploring with the Data Explorer
    - Configuring nteract Desktop App
        - Command line `.json` file
            - Options, Examples
            - Explanations
    - Desktop Keyboard Shortcuts
        - Windows + Mac options in table
    - Contributing
        - Code
        - Docs
- Software Development Kit
    - table with link to API docs
- SDK Groups

> sdk structure
>    intro, definition
>    example
>    explanation

## Software Development Kit Groups
- Core
    - /actions
    - /core
    - /epics
    - /reducers
    - /selectors
    - /types
- Mythic
    - /mythic-configuration
    - /mythic-multiselect
    - /mythic-notifications
    - /mythic-windowing
    - /myths
- Components
    - /notebook-app-component
    - /presentational-components
    - /stateful-components
    - /styles
- Group 4 (name?)
    - /host-cache
    - /rx-binder
- Group 5 (name?)
    - /commutable
    - /messaging
    - /rx-jupyter
- Editors
    - /editor
    - /monaco-editor
- Other (name?)
    - /connected-components
    - /fixtures

**list of SDK packages**
~~1. actions~~
~~2. commutable~~
3. connected-components
    - [ ]
~~4. core~~
5. editor
    - [ ]
~~6. epics~~
7. fixtures
    - [ ]
8. host-cache
    - [ ]
9. messaging
    - [ ]
10. monaco-editor
    - [ ]
11. mythic-configuration
    - [ ]
12. mythic-multiselect
    - [ ]
13. mythic-notifications
    - [ ]
14. mythic-windowing
    - [ ]
15. myths
    - [ ]
16. notebook-app-component
    - [ ]
17. presentation-components
    - [ ]
18. reducers
    - [ ]
19. rx-binder
    - [ ]
20. rx-jupyter
    - [ ]
21. selectors
    - [ ]
~~22. stateful-components~~
23. styles
    - [ ]
24. types
    - [ ]

# Editing the documentation
- SDK files
    - packages
        - docs
            - markdown files for docs
        - mkdocs.yml
            - structure and navigation format
- docs site structure
    - docs folder
        - guide pages
            - data viz, desktop config, getting started, index, key shortcuts
    - nteract/mkdocs.yml
        - nav bar on left

## Prose Actions
**Grouping tasks**
1. Copy/Paste items from package docs
2. Format headings correctly
3. Highlight missing documentation information
4. Contact devs for general explanation of missing info
5. Fill in details for incomplete packages
6. Dev feedback/review
7. Edit
8. Repeat steps 5-7 as necessary