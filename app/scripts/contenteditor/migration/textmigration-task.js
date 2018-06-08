'use strict';

org.ekstep.contenteditor.migration.textmigration_task = new (Class.extend({
    _constants: {
        /**
         * Name of migration plugin
         * @member {String} pluginName
         */
        pluginName: 'org.ekstep.text',
        /**
         * Current version of plugin loaded
         * Assigned at the time of migrating text plugin
         * @member {String} currentTextVersion
         */
        currentTextVersion: 1.2,
        /**
         * Default font of text plugin
         * @member {String} defaultFont
         */
        defaultFont: "NotoSans",
    },
    /**
     * The events are registred which are used to add or remove text migrate events
     */
    init: function () {
        console.log('text migration-task initialized');
        org.ekstep.contenteditor.api.addEventListener(this._constants.pluginName + ':migrateAll', this.migrateAllText, this);
        org.ekstep.contenteditor.api.addEventListener(this._constants.pluginName + ':migrate', this.migrateText, this);
    },
    /**
     * Method to migrate all the old text to new text plugin
     */
    migrateAllText: function () {
        var instance = this;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function (stage, index) {
            _.forEach(stage.children, function (plugin) {
                if (plugin.manifest.id != instance._constants.pluginName) return;
                if (!plugin.attributes.version || plugin.attributes.version < instance._constants.currentTextVersion) {
                    plugin.attributes.version = instance._constants.currentTextVersion;
                    instance.setDefaultFont(plugin);
                    TextWYSIWYG.setProperties(plugin);
                }
            })
        });
    },
    /**
    * Method to check if old text plugin available in content or not
    */
    isOldPluginAvailable: function() {
        var instance = this;
        var oldPluginAvailable = false;
        var stages = org.ekstep.contenteditor.stageManager.stages;
        _.forEach(stages, function (stage) {
            _.forEach(stage.children, function (plugin) {
                if (plugin.manifest.id != instance._constants.pluginName) return;
                if (!plugin.attributes.version || plugin.attributes.version < instance._constants.currentTextVersion) {
                    oldPluginAvailable = true;
                    return;
                }
            })
        })
        return oldPluginAvailable;
    },
    /**
    * Migrate selected text
    */
    migrateText: function(event, textInstance) {
        if (textInstance.manifest.id != this._constants.pluginName) return;
        if (!textInstance.attributes.version || textInstance.attributes.version < this._constants.currentTextVersion) {
            textInstance.attributes.version = this._constants.currentTextVersion;
            this.setDefaultFont(textInstance);
            TextWYSIWYG.setProperties(textInstance);
        }
    },
    /**
     * This will change the font family to default font if font family is not supported
     * @param {object} textInstance - text instance.
     * @returns {void}
     */
    setDefaultFont: function(textInstance) {
        var supportedFonts = textInstance.supportedFonts;
        if (!_.includes(supportedFonts, textInstance.attributes.fontFamily)) {
            textInstance.editorObj.setFontFamily(this._constants.defaultFont);
            textInstance.attributes.fontFamily = this._constants.defaultFont;
            textInstance.attributes.fontfamily = this._constants.defaultFont;
        }
    }

}));

//# sourceURL=textMigration.js