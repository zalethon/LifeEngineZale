const CellStates = require("../CellStates");
const BodyCell = require("./BodyCell");
// const Hyperparams = require("../../../Hyperparameters");
// const Directions = require("../../Directions");
// const Observation = require("../../Perception/Observation")

class SignalCell extends BodyCell{
    constructor(org, loc_col, loc_row){
        super(CellStates.signal, org, loc_col, loc_row);
        this.org.anatomy.has_signal = true;
    }
}

module.exports = SignalCell;