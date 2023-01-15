import config from "../data/config";
import {flag, getClosestPlayer, getScore} from "../util";
import * as Minecraft from "@minecraft/server";


export function illegalitemsB(entity, debug) {
    if(entity.typeId === "minecraft:item") {
        const item = entity.getComponent("item").itemStack;

        const is_items_very_illegal = config.itemLists.items_very_illegal.includes(item.typeId)
        const is_items_semi_illegal = config.itemLists.items_semi_illegal.includes(item.typeId)
        const is_cbe_items = config.itemLists.cbe_items.includes(item.typeId)

        if(is_items_very_illegal || is_items_semi_illegal) {
            entity.kill();
            return true;
        }

        if(is_cbe_items) {
            entity.kill();
            return true;
        }
    }
    return false;
}

export function illegalitemsH(event_obj, debug){
    const block = event_obj.block;
    const player = event_obj.player;

    // IllegalItems/H = event_handlers for pistons that can break any block
    if(block.typeId === "minecraft:piston" || block.typeId === "minecraft:sticky_piston") {
        const piston = block.getComponent("piston");

        if(!piston.isRetracted || piston.isMoving || piston.isExpanded) {
            flag(
                player,
                "IllegalItems",
                "H",
                "Exploit",
                "isRetracted",
                `
                    ${piston.isRetracted},
                    isRetracting=${piston.isRetracting},
                    isMoving=${piston.isMoving},
                    isExpanding=${piston.isExpanding},
                    isExpanded=${piston.isExpanded}
                `,
                false,
                false,
                player.selectedSlot
            );
            block.setType(Minecraft.MinecraftBlockTypes.air);
            return true;
        }
    }
    return false;
}

export function illegalitemsI(event_obj, debug) {
    const block = event_obj.block;
    const player = event_obj.player;

    if(config.modules.illegalitemsI.container_blocks.includes(block.typeId)) {
        const container = block.getComponent("inventory").container;

        let startNumber = 0;
        let didFindItems = false;
        const emptySlots = container.emptySlotsCount;
        if(container.size > 27) startNumber = container.size / 2;

        for(let i = startNumber; i < container.size; i++) {
            const item = container.getItem(i);
            if(typeof item === "undefined") continue;

            // an item exists within the container
            container.clearItem(i);
            didFindItems = true;
        }

        if(didFindItems === true) {
            flag(
                player,
                "IllegalItems",
                "I",
                "Exploit",
                "containerBlock",
                `${block.typeId},totalSlots=${container.size},emptySlots=${emptySlots}`,
                undefined,
                undefined,
                player.selectedSlot
            );
            block.setType(Minecraft.MinecraftBlockTypes.air);
            return true;
        }
    }
    return false;
}

export function illegalitemsJ(event_obj, debug) {
    const block = event_obj.block;
    const player = event_obj.player;
    let is_illegal = false;

    if(block.typeId.includes("sign")) {
        // we need to wait 1 tick before we can get the sign text
        Minecraft.system.run(() => {
            const text = block.getComponent("sign").text;

            if(text.length >= config.modules.illegalitemsJ.max_sign_characters) {
                flag(
                    player,
                    "IllegalItems",
                    "J",
                    "Exploit",
                    "signText",
                    text,
                    undefined,
                    undefined,
                    player.selectedSlot
                );
                block.setType(Minecraft.MinecraftBlockTypes.air);
                is_illegal = true;
            }
        });
    }
    return is_illegal;
}

export function illegalitemsK(entityCreate, debug) {
    const entity = entityCreate.entity;
    // IllegalItems/K = check if a player places a chest boat with items already inside it
    if(config.modules.illegalitemsK.entities.includes(entity.typeId) && !entity.hasTag("didCheck")) {
        entity.addTag("didCheck");
        Minecraft.system.run(() => {
            const player = getClosestPlayer(entity);
            if(typeof player === "undefined") return;

            const container = entity.getComponent("inventory").container;

            if(container.size !== container.emptySlotsCount) {
                for(let i = 0; i < container.size; i++) {
                    container.clearItem(i);
                }

                flag(
                    player,
                    "IllegalItems",
                    "K", "Exploit",
                    "totalSlots",
                    `
                        ${container.size},
                        emptySlots=${container.emptySlotsCount}
                    `,
                    undefined,
                    undefined,
                    player.selectedSlot
                );
                entity.kill();
                return true;
            }
        });
    }
    return false;
}

export function illegalitemsE(beforeItemUseOn, debug) {
    /*
        illegalitems/e = cancels the placement of illegal items
        illegalitems/a could be bypassed by using a right click autoclicker/autobuild or lag
        thx drib or matrix_code
    */
    const player = beforeItemUseOn.source;
    const item = beforeItemUseOn.item;

    let flagPlayer = false;

    // patch element blocks
    if (config.itemLists.elements && item.typeId.startsWith("minecraft:element_"))
        flagPlayer = true;

    // patch spawn eggs
    if (item.typeId.endsWith("_spawn_egg")) {
        if (config.itemLists.spawnEggs.clearVanillaSpawnEggs && item.typeId.startsWith("minecraft:"))
            flagPlayer = true;

        if (config.itemLists.spawnEggs.clearCustomSpawnEggs && !item.typeId.startsWith("minecraft:"))
            flagPlayer = true;
    }

    if (config.itemLists.items_semi_illegal.includes(item.typeId) || flagPlayer === true) {
        const checkGmc = World.getPlayers({
            excludeGameModes: [Minecraft.GameMode.creative],
            name: player.name
        });

        if ([...checkGmc].length !== 0) {
            flag(
                player,
                "IllegalItems",
                "E",
                "Exploit",
                "block",
                item.typeId,
                undefined,
                undefined,
                player.selectedSlot
            );
            beforeItemUseOn.cancel = true;
            return true;
        }
    }
    return false;
}

export function illegalitemsL(entityHurt, debug) {
    const player = entityHurt.hurtEntity;

    if(player.typeId !== "minecraft:player") return false;

    let is_illegal = false;
    if(getScore(player, "keepinventory") <= 0) {
        player.runCommandAsync("scoreboard players operation @a keepinventory = scythe:config keepinventory");
        if(getScore(player, "keepinventory") <= 0) {
            const health = player.getComponent("health").current;


            if(health <= 0) {
                Minecraft.system.run(() => Minecraft.system.run(() => {
                    if(!player.hasTag("dead")) return;
                    const container = player.getComponent("inventory").container;

                    if(container.size !== container.emptySlotsCount) {
                        flag(player, "IllegalItems", "L", "Exploit");
                        is_illegal = true;
                    }

                    // incase the player has keep on death armor, we clear their inventory
                    player.runCommandAsync("clear @s");
                }));
            }
        }
    }
    return is_illegal;
}
