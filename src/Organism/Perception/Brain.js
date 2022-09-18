const Hyperparams = require("../../Hyperparameters");
const Directions = require("../Directions");
const CellStates = require("../Cell/CellStates");

const Decision = {
    neutral: 0,
    retreat: 1,
    chase: 2,
    signal: 3,
    getRandom: function(){
        return Math.floor(Math.random() * 4);
    },
    getRandomNonNeutral: function() {
        return Math.floor(Math.random() * 3)+1;
    }
}

class Brain {
    constructor(owner){
        this.owner = owner;
        this.observations = [];

        // corresponds to CellTypes
        this.decisions = {};
        for (let cell of CellStates.all) {
            this.decisions[cell.name] = Decision.neutral;
        }
        for (let signal_state of CellStates.signal.signal_states) {
            this.decisions[signal_state] = Decision.signal;
        }
        this.decisions[CellStates.food.name] = Decision.chase;
        this.decisions[CellStates.killer.name] = Decision.retreat;
    }

    copy(brain) {
        for (let dec in brain.decisions) {
            this.decisions[dec] = brain.decisions[dec];
        }
    }

    randomizeDecisions(randomize_all=false) {
        // randomize the non obvious decisions
        if (randomize_all) {
            this.decisions[CellStates.food.name] = Decision.getRandom();
            this.decisions[CellStates.killer.name] = Decision.getRandom();
        }
        this.decisions[CellStates.mouth.name] = Decision.getRandom();
        this.decisions[CellStates.producer.name] = Decision.getRandom();
        this.decisions[CellStates.mover.name] = Decision.getRandom();
        this.decisions[CellStates.armor.name] = Decision.getRandom();
        this.decisions[CellStates.eye.name] = Decision.getRandom();
        for (let signal_state of CellStates.signal.signal_states) {
            this.decisions[signal_state] = Decision.getRandom();
        }
    }

    observe(observation) {
        this.observations.push(observation);
    }

    decide() {
        var decision = Decision.neutral;
        var closest = Hyperparams.lookRange + 1;
        var move_direction = 0;
        for (var obs of this.observations) {
            if (obs.cell == null || obs.cell.owner == this.owner) {
                continue;
            }
            if (obs.distance < closest) {
                if (obs.cell.state.name == "signal") {
                    decision = this.decisions[obs.cell.state.signal_states[obs.cell.owner.signal_state]];
                } else {
                    decision = this.decisions[obs.cell.state.name];
                }
                move_direction = obs.direction;
                closest = obs.distance;
            }
        }
        this.observations = [];
        this.owner.signal_state = decision;
        if (decision == Decision.chase) {
            this.owner.changeDirection(move_direction);
            return true;
        }
        else if (decision == Decision.retreat) {
            this.owner.changeDirection(Directions.getOppositeDirection(move_direction));
            return true;
        }
        return false;
    }

    mutate() {
        this.decisions[CellStates.getRandomName()] = Decision.getRandom();
        this.decisions[CellStates.empty.name] = Decision.neutral; // if the empty cell has a decision it gets weird
    }
    
    serialize() {
        return {decisions: this.decisions};
    }
}

Brain.Decision = Decision;

module.exports = Brain;