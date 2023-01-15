import config from "../data/config";
import * as Minecraft from "@minecraft/server";
import {flag} from "../util";

export function instabreak_a(blockBreak, debug) {
    /*
        InstaBreak/A = event_handlers if a player in survival breaks an unbreakable block
        While the InstaBreak method used in Horion and Zephyr are patched, there are still some bypasses
        that can be used
    */

    const player = blockBreak.player;
    const dimension = blockBreak.dimension;
    const block = blockBreak.block;

    if(config.modules.instabreakA.unbreakable_blocks.includes(blockBreak.brokenBlockPermutation.type.id)) {
        const checkGmc = World.getPlayers({
            excludeGameModes: [Minecraft.GameMode.creative],
            name: player.name
        });

        if([...checkGmc].length !== 0) {
            flag(
                player,
                "InstaBreak",
                "A",
                "Exploit",
                "block",
                blockBreak.brokenBlockPermutation.type.id
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
    }
    return false;
}