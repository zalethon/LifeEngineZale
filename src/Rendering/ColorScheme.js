const CellStates = require("../Organism/Cell/CellStates");

var color_scheme = {
    "empty":"#0E1318",
    "food":"#2F7AB7",
    "wall":"gray",
    "mouth":"#DEB14D",
    "producer":"#15DE59",
    "mover":"#60D4FF",
    "killer":"#F82380",
    "armor":"#7230DB",
    "eye":"#B6C1EA",
    "eye-slit": "#0E1318",
    "signal": "#222222",
    "sig1": "#000000",
    "sig2": "#FF0000",
    "sig3": "#00FF00",
    "sig4": "#FFFF00"
};

// Renderer controls access to a canvas. There is one renderer for each canvas
class ColorScheme {
    constructor(world_env, editor_env) {
        this.world_env = world_env;
        this.editor_env = editor_env;
    }

    loadColorScheme() {
        for (var state of CellStates.all) {
            state.color = color_scheme[state.name];
        }

        CellStates.signal.color_list = [
            color_scheme[CellStates.signal.signal_states[0]],
            color_scheme[CellStates.signal.signal_states[1]],
            color_scheme[CellStates.signal.signal_states[2]],
            color_scheme[CellStates.signal.signal_states[3]]
        ];

        CellStates.signal.sig_color=color_scheme[CellStates.signal.signal_states[0]]
        CellStates.eye.slit_color=color_scheme['eye-slit']
        for (var cell_type in color_scheme) {
            $('#'+cell_type+'.cell-type ').css('background-color', color_scheme[cell_type]);
            $('#'+cell_type+'.cell-legend-type').css('background-color', color_scheme[cell_type]);
            
        }
        this.world_env.renderer.renderFullGrid(this.world_env.grid_map.grid);
        this.editor_env.renderer.renderFullGrid(this.editor_env.grid_map.grid);
    }
}

module.exports = ColorScheme;