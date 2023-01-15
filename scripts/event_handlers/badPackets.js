import config from "../data/config";
import {flag} from "../util";

export function badPackets_2(msg, debug) {
    let player = msg.sender;
    let message = msg.message.toLowerCase().trim();

    if(message.length > config.modules.badpackets2.maxlength || message.length < config.modules.badpackets2.minLength) {
        flag(
            player,
            "BadPackets",
            "2",
            "Exploit",
            "messageLength",
            `${message.length}`,
            undefined,
            msg
        );
        return true;
    }
    return false;
}

export function badPackets_3(entityHit, debug) {
    const entity = entityHit.hitEntity;
    const player = entityHit.entity;

    // if (debug) {
    //     console.warn("badPackets_3", entity, player);
    // }

    if(player.typeId !== "minecraft:player") return false;

    if (typeof entity === "object") {
        // badpackets[3] = check if a player attacks themselves
        // some (bad) hacks use this to bypass anti-movement
        if (entity.id === player.id) {
            flag(player, "BadPackets", "3", "Exploit");
            return true;
        }
    }
    return false;
}
