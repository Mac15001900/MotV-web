//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

window.onload = function () {
    window.testObject = 42;
    SceneManager.run(Scene_Boot);
};
