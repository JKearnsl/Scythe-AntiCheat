import config from "../data/config";
import {flag} from "../util";

export function badPackets_2(msg) {
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

export function badPackets_3(entityHit) {
    const entity = entityHit.hitEntity;
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return false;

    // badpackets[3] = check if a player attacks themselves
    // some (bad) hacks use this to bypass anti-movement cheat event_handlers
    if(entity.id === player.id) {
        flag(player, "BadPackets", "3", "Exploit");
        return true;
    }
    return false;
}
