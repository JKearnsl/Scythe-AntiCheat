import config from "../data/config";
import {flag} from "../util";
import * as Minecraft from "@minecraft/server";

export function nuker_a(blockBreak, debug) {
    const player = blockBreak.player;
    const dimension = blockBreak.dimension;
    const block = blockBreak.block;

    // nuker/a = event_handlers if a player breaks more blocks in a tick
    player.blocksBroken++;

    if(player.blocksBroken > config.modules.nukerA.maxBlocks) {
        flag(
            player,
            "Nuker",
            "A",
            "Misc",
            "blocksBroken",
            player.blocksBroken
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

