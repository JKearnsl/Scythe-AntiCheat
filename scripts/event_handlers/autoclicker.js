import config from "../data/config";
import data from "../data/data";
import {getScore} from "../util";

export function autoclicker_a(entityHit, debug) {
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return false;

    // autoclicker/a = check for high cps
    // if anti-autoclicker is disabled in game then disable it in config.js
    if(data.checkedModules.autoclicker === false) {
        if(getScore(player, "autoclicker", 1) >= 1) {
            config.modules.autoclickerA.enabled = false;
        }
        data.checkedModules.autoclicker = true;
    }
    // TODO: finish this
    player.cps++;
}