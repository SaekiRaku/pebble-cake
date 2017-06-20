module.exports = [{
        "type": "heading",
        "defaultValue": "Watchface Configuration"
    },
    {
        "type": "text",
        "defaultValue": "This watchface is open source, you can find out the github repo on Pebble's about page."
    },
    {
        "type": "section",
        "items": [{
                "type": "heading",
                "defaultValue": "Colors Settings"
            },
            {
                "type": "color",
                "messageKey": "color",
                "defaultValue": "0x00FFAA",
                "layout": "COLOR",
                "label": "Theme Color"
            }
        ]
    },
    {
        "type": "section",
        "items": [{
                "type": "heading",
                "defaultValue": "More Settings"
            },
            {
                "type": "select",
                "messageKey": "language",
                "label": "Language",
                "defaultValue": "english",
                "options": [{
                        "label": "English",
                        "value": "english"
                    },
                    {
                        "label": "简体中文",
                        "value": "chinese"
                    }
                ]
            }
        ]
    },
    {
        "type": "submit",
        "defaultValue": "Save Settings"
    }
];