module.exports = [{
        "type": "heading",
        "defaultValue": "表盘设置"
    },
    {
        "type": "text",
        "defaultValue": "该表盘程序源代码已托管在Github，您可以再Pebble的关于页面上访问Repo地址。"
    },
    {
        "type": "section",
        "items": [{
                "type": "heading",
                "defaultValue": "颜色设置"
            },
            {
                "type": "color",
                "messageKey": "color",
                "defaultValue": "0x00FFAA",
                "layout": "COLOR",
                "label": "主题颜色"
            }
        ]
    },
    {
        "type": "section",
        "items": [{
                "type": "heading",
                "defaultValue": "更多设置"
            },
            {
                "type": "select",
                "messageKey": "language",
                "label": "语言",
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