import config from "../data/config";
import {flag} from "../util";

export function killaura_c(entityHit, debug) {
    const entity = entityHit.hitEntity;
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return false;

    if(typeof entity === "object") {
        // killaura/C = check for multi-aura
        if (!player.entitiesHit.includes(entity.id)) {
            player.entitiesHit.push(entity.id);
            if (player.entitiesHit.length >= config.modules.killauraC.entities) {
                flag(
                    player,
                    "KillAura",
                    "C",
                    "Combat",
                    "entitiesHit",
                    player.entitiesHit.length
                );
                return true;
            }
        }
    }
    return false;
}

export function killaura_d(entityHit, debug) {
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return false;

    if(player.hasTag("sleeping")) {
        flag(player, "Killaura", "D", "Combat");
        return true;
    }
    return false;
}
