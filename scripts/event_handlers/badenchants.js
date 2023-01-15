import * as Minecraft from "@minecraft/server";
import config from "../data/config";
import {flag} from "../util";

export function badenchants_a(beforeItemUse, debug) {
    const item = beforeItemUse.item;
    const player = beforeItemUse.source;
    const itemEnchants = item.getComponent("enchantments").enchantments;


    let iterator = itemEnchants[Symbol.iterator]()
    let iteratorResult = iterator.next();
    let enchantData = null;

    while (iteratorResult.done === false) {
        enchantData = iteratorResult.value;

        // badenchants/A = check for items with invalid enchantment levels
        const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type.id];
        if (typeof maxLevel === "number") {
            if (enchantData.level > maxLevel) {
                flag(
                    player,
                    "BadEnchants",
                    "A",
                    "Exploit",
                    "enchant",
                    `
                    minecraft:${enchantData.type.id},
                    level=${enchantData.level}`,
                    undefined,
                    undefined,
                    player.selectedSlot
                );
                return true
            }
        } else if (enchantData.level > enchantData.type.maxLevel) {
            flag(
                player,
                "BadEnchants",
                "A",
                "Exploit",
                "enchant",
                `
                minecraft:${enchantData.type.id},
                level=${enchantData.level}`,
                undefined,
                undefined,
                player.selectedSlot
            );
            return true
        }
        iteratorResult = iterator.next();
    }
    return false;
}


export function badenchants_b(beforeItemUse, debug) {
    const item = beforeItemUse.item;
    const player = beforeItemUse.source;
    const itemEnchants = item.getComponent("enchantments").enchantments;


    let iterator = itemEnchants[Symbol.iterator]()
    let iteratorResult = iterator.next();
    let enchantData = null;

    while (iteratorResult.done === false) {
        enchantData = iteratorResult.value;

        // badenchants/B = event_handlers for negative enchantment levels
        if(enchantData.level <= 0) {
            flag(
                player,
                "BadEnchants",
                "B",
                "Exploit",
                "enchant",
                `
                minecraft:${enchantData.type.id},
                level=${enchantData.level}`,
                undefined,
                undefined,
                player.selectedSlot
            );
            return true;
        }
        iteratorResult = iterator.next();
    }
    return false;
}

export function badenchants_c(beforeItemUse, debug) {
    const item = beforeItemUse.item;
    const player = beforeItemUse.source;
    const itemEnchants = item.getComponent("enchantments").enchantments;

    let itemType = Minecraft.ItemTypes.get(item.typeId); // new const itemType = Minecraft.ItemTypes.get(item.typeId) ?? Minecraft.ItemTypes.get("minecraft:book");
    if(typeof itemType === "undefined") itemType = Minecraft.ItemTypes.get("minecraft:book");

    const item2 = new Minecraft.ItemStack(itemType, 1, item.data);
    const item2Enchants = item2.getComponent("enchantments").enchantments;


    let iterator = itemEnchants[Symbol.iterator]()
    let iteratorResult = iterator.next();
    let enchantData = null;

    while (iteratorResult.done === false) {
        enchantData = iteratorResult.value;

        // badenchants/C = check if an item has an enchantment which isnt support by the item

        if(!item2Enchants.canAddEnchantment(new Minecraft.Enchantment(enchantData.type, 1))) {
            flag(
                player,
                "BadEnchants",
                "C",
                "Exploit",
                "item",
                `
                ${item.typeId},
                enchant=minecraft:${enchantData.type.id},
                level=${enchantData.level}`,
                undefined,
                undefined,
                player.selectedSlot
            );
            return true;
        }

        if(config.modules.badenchantsB.multi_protection === true) {
            item2Enchants.addEnchantment(new Minecraft.Enchantment(enchantData.type, 1));
            item2.getComponent("enchantments").enchantments = item2Enchants;
        }
        iteratorResult = iterator.next();
    }
    return false;
}

export function badenchants_e(beforeItemUse, debug) {
    const item = beforeItemUse.item;
    const player = beforeItemUse.source;
    const itemEnchants = item.getComponent("enchantments").enchantments;

    const enchantments = new Set();

    let iterator = itemEnchants[Symbol.iterator]()
    let iteratorResult = iterator.next();
    let enchantData = null;

    while (iteratorResult.done === false) {
        enchantData = iteratorResult.value;

        // BadEnchants/E = check if an item has duplicated enchantments ???
        if(enchantments.has(enchantData.type.id)) {
            enchantments.add(enchantData.type.id);
            flag(
                player,
                "BadEnchants",
                "E",
                "Exploit",
                "enchantments",
                (Array.from(enchantments)).join(","),
                false,
                undefined ,
                player.selectedSlot
            );
            return true;
        }
        enchantments.add(enchantData.type.id);
        iteratorResult = iterator.next();
    }
    return false;
}
