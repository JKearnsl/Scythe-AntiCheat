import config from "../data/config";
import {flag} from "../util";
import * as Minecraft from "@minecraft/server";

export function autotool_a_init(entityHit, debug) {
    const block = entityHit.hitBlock;
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return false;

    if(typeof block === "object") {
        player.flagAutotoolA = false;
        player.lastSelectedSlot = player.selectedSlot;
        player.startBreakTime = Date.now();
        player.autotoolSwitchDelay = 0;
    }
}

export function autotool_a(blockBreak, debug) {
    const player = blockBreak.player;
    const dimension = blockBreak.dimension;
    const block = blockBreak.block;

    // Autotool/A = event_handlers for player slot mismatch
    if(player.flagAutotoolA === true) {
        flag(
            player,
            "AutoTool",
            "A",
            "Misc",
            "selectedSlot",
            `
                ${player.selectedSlot},
                lastSelectedSlot=${player.lastSelectedSlot},
                switchDelay=${player.autotoolSwitchDelay}
            `
        );

        // killing all the items it drops
        const droppedItems = dimension.getEntities({
            location: new Minecraft.Location(block.location.x, block.location.y, block.location.z),
            minDistance: 0,
            maxDistance: 2,
            type: "item"
        });

        for (const item of droppedItems) item.kill();
        block.setPermutation(blockBreak.brokenBlockPermutation);
        return true;
    }
    return false;
}