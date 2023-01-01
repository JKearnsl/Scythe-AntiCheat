import config from "../data/config";
import {flag} from "../util";
import * as Minecraft from "@minecraft/server";

export function is_muted(msg) {
    let message = msg.message.toLowerCase().trim();
    let player = msg.sender;

    if(config.debug === true && message === "ping") console.warn(`${new Date().toISOString()} | Pong!`);

    if(player.hasTag("isMuted")) {
        msg.cancel = true;
        player.tell("§r§6[§aScythe§6]§r §a§lNOPE! §r§aYou have been muted.");
        return true;
    }
    return false;
}

export function spammer_a(msg) {
    let player = msg.sender;

    // Spammer/A = checks if someone sends a message while moving and on ground
    let is_player_moving_on_ground = player.hasTag('moving') && player.hasTag('ground') && !player.hasTag('jump')
    if(is_player_moving_on_ground && player.velocity.y.toFixed(4) === "-0.0784") {
        flag(
            player,
            "Spammer",
            "A",
            "Movement",
            undefined,
            undefined,
            true,
            msg
        );
        return true;
    }
    return false;
}

export function spammer_b(msg) {
    let player = msg.sender;

    // Spammer/B = checks if someone sends a message while swinging their hand
    if(player.hasTag('left') && !player.getEffect(Minecraft.MinecraftEffectTypes.miningFatigue))
    {
        flag(
            player,
            "Spammer",
            "B",
            "Combat",
            undefined,
            undefined,
            undefined,
            msg
        );
        return true;
    }
    return false;
}

export function spammer_c(msg) {
    let player = msg.sender;

    // Spammer/C = checks if someone sends a message while using an item
    if(player.hasTag('right'))
    {
        flag(
            player,
            "Spammer",
            "C",
            "Misc",
            undefined,
            undefined,
            undefined,
            msg
        );
        return true;
    }
    return false;
}

export function spammer_d(msg) {
    let player = msg.sender;

    // Spammer/D = checks if someone sends a message while having a GUI open
    if(player.hasTag('hasGUIopen'))
    {
        flag(
            player,
            "Spammer",
            "D",
            "Misc",
            undefined,
            undefined,
            undefined,
            msg
        );
        return true;
    }
    return false;
}
