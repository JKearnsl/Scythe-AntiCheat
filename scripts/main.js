import {world, system} from "@minecraft/server";
import * as Minecraft from "@minecraft/server"; // temp
import { flag, banMessage, getClosestPlayer, getScore } from "./util.js";
import { commandHandler } from "./commands/handler.js";
import config from "./data/config.js";
import { banList } from "./data/globalban.js";
import data from "./data/data.js";
import { mainGui, playerSettingsMenuSelected } from "./features/ui.js";
import EventRouter from "./event_handlers/router.js";
import {
    filterSymbols,
    filterUnicode,
    is_muted,
    sayMessage,
    spammer_a,
    spammer_b,
    spammer_c,
    spammer_d
} from "./event_handlers/chat.js";
import {badPackets_2, badPackets_3} from "./event_handlers/badPackets.js";
import {
    illegalitemsB,
    illegalitemsE,
    illegalitemsH,
    illegalitemsI,
    illegalitemsJ, illegalitemsK, illegalitemsL
} from "./event_handlers/illegalitems.js";
import {
    commandBlockExploitF,
    commandBlockExploitG,
    commandBlockExploitH
} from "./event_handlers/commandBlockExploit.js";
import {nuker_a} from "./event_handlers/nuker.js";
import {autotool_a, autotool_a_init} from "./event_handlers/autotool.js";
import {instabreak_a} from "./event_handlers/instabreak.js";
import {player_init} from "./event_handlers/player_init.js";
import {namespoof_a, namespoof_b, namespoof_c} from "./event_handlers/namespoof.js";
import {is_global_banned} from "./event_handlers/isglobalbanned.js";
import {itemSpawnRateLimit} from "./event_handlers/itemSpawnRateLimit.js";
import {antiArmorStandCluster} from "./event_handlers/antiArmorStandCluster.js";
import {killaura_c, killaura_d} from "./event_handlers/killaura.js";
import {reach_a} from "./event_handlers/reach.js";
import {playerWasHitWithUI} from "./event_handlers/playerWasHitWithUI.js";
import {autoclicker_a} from "./event_handlers/autoclicker.js";
import Enum from "./utils/enum.js";
import {fastuse_a} from "./event_handlers/fastuse.js";
import {is_freeze} from "./event_handlers/isfreeze.js";
import {is_ui_item} from "./event_handlers/is_ui_item.js";
import {badenchants_a, badenchants_b, badenchants_c, badenchants_e} from "./event_handlers/badenchants.js";



if(config.debug)
    console.warn(`${new Date().toISOString()} | Im not a ******* and this actually worked :sunglasses:`);

const filter = Enum({
    EXCLUDE_SCYTHEOP: 0,
    ONLY_SCYTHEOP: 1
});


// Register event_handlers

// beforeChat
const router = new EventRouter(config.debug);
router.registerHandler("beforeChat", is_muted);

if (config.modules.badpackets2.enabled) {
    router.registerHandler("beforeChat", badPackets_2);
}

if (config.modules.spammerA.enabled) {
    router.registerHandler("beforeChat", spammer_a);
}

if (config.modules.spammerB.enabled) {
    router.registerHandler("beforeChat", spammer_b);
}

if (config.modules.spammerC.enabled) {
    router.registerHandler("beforeChat", spammer_c);
}

if (config.modules.spammerD.enabled) {
    router.registerHandler("beforeChat", spammer_d);
}

router.registerHandler("beforeChat", commandHandler, true);
if (config.modules.filterUnicodeChat.enabled) {
    router.registerHandler("beforeChat", filterUnicode, true);
}
router.registerHandler("beforeChat", filterSymbols, true);
router.registerHandler("beforeChat", sayMessage, true);

// blockPlace

if (config.modules.illegalitemsH.enabled) {
    router.registerHandler("blockPlace", illegalitemsH);
}

if (config.modules.illegalitemsI.enabled) {
    router.registerHandler("blockPlace", illegalitemsI);
}

if (config.modules.illegalitemsJ.enabled) {
    router.registerHandler("blockPlace", illegalitemsJ);
}

if (config.modules.commandblockexploitH.enabled) {
    router.registerHandler("blockPlace", commandBlockExploitH);
}

// blockBreak

if (config.modules.nukerA.enabled) {
    router.registerHandler("blockBreak", nuker_a);
}

if (config.modules.autotoolA.enabled) {
    router.registerHandler("blockBreak", autotool_a);
}

if (config.modules.instabreakA.enabled) {
    router.registerHandler("blockBreak", instabreak_a);
}

// beforeItemUseOn

if (config.modules.commandblockexploitF.enabled) {
    router.registerHandler("beforeItemUseOn", commandBlockExploitF);
}

if (config.modules.illegalitemsE.enabled) {
    router.registerHandler("beforeItemUseOn", illegalitemsE);
}

router.registerHandler("beforeItemUseOn", (beforeItemUseOn, debug) => {
    const player = beforeItemUseOn.source;
    if(player.hasTag("freeze")) beforeItemUseOn.cancel = true;
}, true);

// playerJoin

router.registerHandler("playerJoin", player_init);

router.registerHandler("playerJoin", is_global_banned);

if (config.modules.namespoofC.enabled) {
    router.registerHandler("playerJoin", namespoof_c);
}

if (config.modules.namespoofA.enabled) {
    router.registerHandler("playerJoin", namespoof_a);
}

if (config.modules.namespoofB.enabled) {
    router.registerHandler("playerJoin", namespoof_b);
}

// entityCreate

if (config.modules.itemSpawnRateLimit.enabled) {
    router.registerHandler("entityCreate", itemSpawnRateLimit);
}

if (config.modules.commandblockexploitG.enabled) {
    router.registerHandler("entityCreate", commandBlockExploitG);
}

if (config.modules.illegalitemsB.enabled) {
    router.registerHandler("entityCreate", illegalitemsB);
}

if (config.modules.illegalitemsK.enabled) {
    router.registerHandler("entityCreate", illegalitemsK);
}

if (config.misc_modules.antiArmorStandCluster.enabled) {
    router.registerHandler("entityCreate", antiArmorStandCluster);
}

// entityHit

if (config.modules.killauraC.enabled) {
    router.registerHandler("entityHit", killaura_c);
}

if (config.modules.reachA.enabled) {
    router.registerHandler("entityHit", reach_a);
}

if (config.modules.badpackets3.enabled) {
    router.registerHandler("entityHit", badPackets_3);
}

if (config.customcommands.ui.enabled) {
    router.registerHandler("entityHit", playerWasHitWithUI, true);
}

if (config.modules.autoclickerA.enabled) {
    router.registerHandler("entityHit", autoclicker_a);
}

if (config.modules.killauraD.enabled) {
    router.registerHandler("entityHit", killaura_d);
}

if (config.modules.autotoolA.enabled) {
    router.registerHandler("entityHit", autotool_a_init, true);
}

// beforeItemUse

if (config.customcommands.ui.enabled) {
    router.registerHandler("beforeItemUse", is_ui_item);
}

if (config.modules.fastuseA.enabled) {
    router.registerHandler("beforeItemUse", fastuse_a)
}

if (config.customcommands.freeze.enabled) {
    router.registerHandler("beforeItemUse", is_freeze);
}

if (config.modules.badenchantsA.enabled) {
    router.registerHandler("beforeItemUse", badenchants_a);
}

if (config.modules.badenchantsB.enabled) {
    router.registerHandler("beforeItemUse", badenchants_b);
}

if (config.modules.badenchantsC.enabled) {
    router.registerHandler("beforeItemUse", badenchants_c);
}

if (config.modules.badenchantsE.enabled) {
    router.registerHandler("beforeItemUse", badenchants_e); // ??
}

// entityHurt

if (config.modules.illegalitemsL.enabled) {
    router.registerHandler("entityHurt", illegalitemsL);
}

// beforeWatchdogTerminate

system.events.beforeWatchdogTerminate.subscribe((beforeWatchdogTerminate) => {
    // We try to stop any watchdog crashes incase malicous users try to make the scripts lag
    // and causing the server to crash
    beforeWatchdogTerminate.cancel = true;

    console.warn(
        `${new Date().toISOString()} | 
        A Watchdog Exception has been detected and has been cancelled successfully. 
        Reason: ${beforeWatchdogTerminate.terminateReason}`
    );
});


// when using /reload, the variables defined in playerJoin dont persist
if([...world.getPlayers()].length >= 1) {
    for(const player of world.getPlayers()) {
        if(config.modules.badpackets5.enabled) player.badpackets5Ticks = 0;
        if(config.modules.nukerA.enabled) player.blocksBroken = 0;
        if(config.modules.autoclickerA.enabled) player.firstAttack = Date.now();
        if(config.modules.fastuseA.enabled) player.lastThrow = Date.now() - 200;
        if(config.modules.autoclickerA.enabled) player.cps = 0;
        if(config.modules.killauraC.enabled) player.entitiesHit = [];
        if(config.customcommands.report.enabled) player.reports = [];
    }
}

system.runSchedule(() => {
    if(config.modules.itemSpawnRateLimit.enabled) data.entitiesSpawnedInLastTick = 0;

    // run as each player
    for (const player of world.getPlayers()) {
        try {

            if(player.isGlobalBanned === true) {
                player.addTag("by:Scythe Anticheat");
                player.addTag("reason:You are Scythe Anticheat global banned!");
                player.addTag("isBanned");
            }

            // sexy looking ban message
            if(player.hasTag("isBanned")) banMessage(player);

            if(player.blocksBroken >= 1 && config.modules.nukerA.enabled === true) player.blocksBroken = 0;
            if(player.entitiesHit?.length >= 1 && config.modules.killauraC.enabled === true) player.entitiesHit = [];
            if(Date.now() - player.startBreakTime < config.modules.autotoolA.startBreakDelay && player.lastSelectedSlot !== player.selectedSlot) {
                player.flagAutotoolA = true;
                player.autotoolSwitchDelay = Date.now() - player.startBreakTime;
            }

            // BadPackets[5] = event_handlers for horion freecam
            if(config.modules.badpackets5.enabled && player.velocity.y.toFixed(6) === "0.420000" && !player.hasTag("dead") && !player.hasTag("sleeping")) {
                player.badpackets5Ticks++;
                if(player.badpackets5Ticks > config.modules.badpackets5.sample_size) flag(player, "BadPackets", "5", "Exploit", "yVelocity", player.velocity.y.toFixed(6), true);
            } else if(player.badpackets5Ticks !== 0) player.badpackets5Ticks--;

            // Crasher/A = invalid pos check
            if(config.modules.crasherA.enabled && Math.abs(player.location.x) > 30000000 ||
                Math.abs(player.location.y) > 30000000 || Math.abs(player.location.z) > 30000000)
                flag(player, "Crasher", "A", "Exploit", "x_pos", `${player.location.x},y_pos=${player.location.y},z_pos=${player.location.z}`, true);

            // anti-namespoof
            // these values are set in the playerJoin config
            if(player.flagNamespoofA === true) {
                flag(player, "Namespoof", "A", "Exploit", "nameLength", player.name.length);
                player.flagNamespoofA = false;
            }
            if(player.flagNamespoofB === true) {
                flag(player, "Namespoof", "B", "Exploit");
                player.flagNamespoofB = false;
            }
            if(player.flagNamespoofC === true) {
                flag(player, "Namespoof", "C", "Exploit", "oldName", player.oldName);
                player.flagNamespoofC = false;
            }

            // player position shit
            if(player.hasTag("moving")) {
                player.runCommandAsync(`scoreboard players set @s xPos ${Math.floor(player.location.x)}`);
                player.runCommandAsync(`scoreboard players set @s yPos ${Math.floor(player.location.y)}`);
                player.runCommandAsync(`scoreboard players set @s zPos ${Math.floor(player.location.z)}`);
            }

            if(config.modules.bedrockValidate.enabled === true) {
                if(getScore(player, "bedrock") >= 1) {
                    if(config.modules.bedrockValidate.overworld && player.dimension.id === "minecraft:overworld") {
                        player.runCommandAsync("fill ~-5 -64 ~-5 ~5 -64 ~5 bedrock");
                        player.runCommandAsync("fill ~-4 -59 ~-4 ~4 319 ~4 air 0 replace bedrock");
                    }

                    if(config.modules.bedrockValidate.nether && player.dimension.id === "minecraft:nether") {
                        player.runCommandAsync("fill ~-5 0 ~-5 ~5 0 ~5 bedrock");
                        player.runCommandAsync("fill ~-5 127 ~-5 ~5 127 ~5 bedrock");
                        player.runCommandAsync("fill ~-5 5 ~-5 ~5 120 ~5 air 0 replace bedrock");
                    }
                } else config.modules.bedrockValidate.enabled = false;
            }

            const playerSpeed = Number(Math.sqrt(Math.abs(player.velocity.x**2 + player.velocity.z**2)).toFixed(2));

            // NoSlow/A = speed limit check
            if(config.modules.noslowA.enabled && playerSpeed >= config.modules.noslowA.speed && playerSpeed <= config.modules.noslowA.maxSpeed) {
                if(!player.getEffect(Minecraft.MinecraftEffectTypes.speed) && player.hasTag('moving') && player.hasTag('right') && player.hasTag('ground') && !player.hasTag('jump') && !player.hasTag('gliding') && !player.hasTag('swimming') && !player.hasTag("trident") && getScore(player, "right") >= 5) {
                    flag(player, "NoSlow", "A", "Movement", "speed", playerSpeed, true);
                }
            }

            const container = player.getComponent('inventory').container;
            for (let i = 0; i < container.size; i++) {
                const item = container.getItem(i);
                if(typeof item === "undefined") continue;

                // Illegalitems/C = item stacked over 64 check
                if(config.modules.illegalitemsC.enabled && item.amount > config.modules.illegalitemsC.maxStack)
                    flag(player, "IllegalItems", "C", "Exploit", "stack", item.amount, undefined, undefined, i);

                // Illegalitems/D = additional item clearing check
                if(config.modules.illegalitemsD.enabled === true) {
                    if(config.itemLists.items_very_illegal.includes(item.typeId)) flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, i);

                    // semi illegal items
                    if(!player.hasTag("op")) {
                        let flagPlayer = false;
                        // patch element blocks
                        if(config.itemLists.elements && item.typeId.startsWith("minecraft:element_"))
                            flagPlayer = true;

                        // patch spawn eggs
                        if(item.typeId.endsWith("_spawn_egg")) {
                            if(config.itemLists.spawnEggs.clearVanillaSpawnEggs && item.typeId.startsWith("minecraft:"))
                                flagPlayer = true;

                            if(config.itemLists.spawnEggs.clearCustomSpawnEggs && !item.typeId.startsWith("minecraft:"))
                                flagPlayer = true;
                        }

                        if(config.itemLists.items_semi_illegal.includes(item.typeId) || flagPlayer === true) {
                            const checkGmc = world.getPlayers({
                                excludeGameModes: [Minecraft.GameMode.creative],
                                name: player.name
                            });

                            if([...checkGmc].length !== 0) {
                                flag(player, "IllegalItems", "D", "Exploit", "item", item.typeId, undefined, undefined, i);
                            }
                        }
                    }
                }

                // CommandBlockExploit/H = clear items
                if(config.modules.commandblockexploitH.enabled && config.itemLists.cbe_items.includes(item.typeId))
                    flag(player, "CommandBlockExploit", "H", "Exploit", "item", item.typeId, undefined, undefined, i);

                // Illegalitems/F = Checks if an item has a name longer then 32 characters
                if(config.modules.illegalitemsF.enabled && item.nameTag?.length > config.modules.illegalitemsF.length)
                    flag(player, "IllegalItems", "F", "Exploit", "name", `${item.nameTag},length=${item.nameTag.length}`, undefined, undefined, i);

                // BadEnchants/D = event_handlers if an item has a lore
                if(config.modules.badenchantsD.enabled && item.getLore().length) {
                    if(!config.modules.badenchantsD.exclusions.includes(String(item.getLore())))
                        flag(player, "BadEnchants", "D", "Exploit", "lore", String(item.getLore()), undefined, undefined, i);
                }

                /*
                    As of 1.19.30, Mojang removed all illegal items from MinecraftItemTypes, although this change
                    doesnt matter, they mistakenly removed 'written_book', which can be obtained normally.
                    Written books will make this code error out, and make any items that havent been check bypass
                    anti32k event_handlers. In older versions, this error will also make certian players not get checked
                    leading to a Scythe Semi-Gametest Disabler method.
                */
                let itemType = Minecraft.ItemTypes.get(item.typeId); // new const itemType = Minecraft.ItemTypes.get(item.typeId) ?? Minecraft.ItemTypes.get("minecraft:book");
                if(typeof itemType === "undefined") itemType = Minecraft.ItemTypes.get("minecraft:book");

                if(config.modules.resetItemData.enabled === true && config.modules.resetItemData.items.includes(item.typeId)) {
                    // This creates a duplicate version of the item, with just its amount and data.
                    const item2 = new Minecraft.ItemStack(itemType, item.amount, item.data);
                    container.setItem(i, item2);
                }

                if(config.modules.badenchantsA.enabled || config.modules.badenchantsB.enabled || config.modules.badenchantsC.enabled) {
                    const itemEnchants = item.getComponent("enchantments").enchantments;

                    const item2 = new Minecraft.ItemStack(itemType, 1, item.data);
                    const item2Enchants = item2.getComponent("enchantments").enchantments;
                    const enchantments = [];

                    const loopIterator = (iterator) => {
                        const iteratorResult = iterator.next();
                        if(iteratorResult.done === true) return;
                        const enchantData = iteratorResult.value;

                        // badenchants/A = event_handlers for items with invalid enchantment levels
                        if(config.modules.badenchantsA.enabled === true) {
                            const maxLevel = config.modules.badenchantsA.levelExclusions[enchantData.type.id];
                            if(typeof maxLevel === "number") {
                                if(enchantData.level > maxLevel) flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                            } else if(enchantData.level > enchantData.type.maxLevel)
                                flag(player, "BadEnchants", "A", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                        }

                        // badenchants/B = event_handlers for negative enchantment levels
                        if(config.modules.badenchantsB.enabled && enchantData.level <= 0)
                            flag(player, "BadEnchants", "B", "Exploit", "enchant", `minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);

                        // badenchants/C = event_handlers if an item has an enchantment which isnt support by the item
                        if(config.modules.badenchantsC.enabled) {
                            if(!item2Enchants.canAddEnchantment(new Minecraft.Enchantment(enchantData.type, 1))) {
                                flag(player, "BadEnchants", "C", "Exploit", "item", `${item.typeId},enchant=minecraft:${enchantData.type.id},level=${enchantData.level}`, undefined, undefined, i);
                            }

                            if(config.modules.badenchantsB.multi_protection === true) {
                                item2Enchants.addEnchantment(new Minecraft.Enchantment(enchantData.type, 1));
                                item2.getComponent("enchantments").enchantments = item2Enchants;
                            }
                        }

                        // BadEnchants/E = event_handlers if an item has duplicated enchantments
                        if(config.modules.badenchantsE.enabled === true) {
                            if(enchantments.includes(enchantData.type.id)) {
                                enchantments.push(enchantData.type.id);
                                flag(player, "BadEnchants", "E", "Exploit", "enchantments", enchantments.join(", "), false, undefined , i);
                            } else enchantments.push(enchantData.type.id);
                        }

                        loopIterator(iterator);
                    };
                    loopIterator(itemEnchants[Symbol.iterator]());
                }
            }

            // invalidsprint/a = event_handlers for sprinting with the blindness effect
            if(config.modules.invalidsprintA.enabled && player.getEffect(Minecraft.MinecraftEffectTypes.blindness) && player.hasTag('sprint'))
                flag(player, "InvalidSprint", "A", "Movement", undefined, undefined, true);

            // fly/a
            if(config.modules.flyA.enabled && Math.abs(player.velocity.y).toFixed(4) === "0.1552" && !player.hasTag("jump") && !player.hasTag("gliding") && !player.hasTag("riding") && !player.hasTag("levitating") && player.hasTag("moving")) {
                const pos1 = new Minecraft.BlockLocation(player.location.x + 2, player.location.y + 2, player.location.z + 2);
                const pos2 = new Minecraft.BlockLocation(player.location.x - 2, player.location.y - 1, player.location.z - 2);

                const isNotInAir = pos1.blocksBetween(pos2).some((block) => player.dimension.getBlock(block).typeId !== "minecraft:air");

                if(isNotInAir === false) flag(player, "Fly", "A", "Movement", "vertical_speed", Math.abs(player.velocity.y).toFixed(4), true);
                else if(config.debug === true) console.warn(`${new Date().toISOString()} | ${player.name} was detected with flyA motion but was found near solid blocks.`);
            }

            if(config.modules.autoclickerA.enabled && player.cps > 0 && Date.now() - player.firstAttack >= config.modules.autoclickerA.checkCPSAfter) {
                player.cps = player.cps / ((Date.now() - player.firstAttack) / 1000);
                // autoclicker/A = event_handlers for high cps
                if(player.cps > config.modules.autoclickerA.maxCPS) flag(player, "Autoclicker", "A", "Combat", "CPS", player.cps);

                // player.runCommandAsync(`say ${player.cps}, ${player.lastCPS}. ${player.cps - player.lastCPS}`);

                /*
                // autoclicker/B = event_handlers if cps is similar to last cps (WIP)
                let cpsDiff = Math.abs(player.cps - player.lastCPS);
                if(player.cps > 3 && cpsDiff > 0.81 && cpsDiff < 0.96) flag(player, "AutoClicker", "B", "Combat", "CPS", `${player.cps},last_cps=${player.lastCPS}`);
                player.lastCPS = player.cps;
                */

                player.firstAttack = Date.now();
                player.cps = 0;
            }

            // BadPackets[4] = event_handlers for invalid selected slot
            if(config.modules.badpackets4.enabled && player.selectedSlot < 0 || player.selectedSlot > 8) {
                flag(player, "BadPackets", "4", "Exploit", "selectedSlot", `${player.selectedSlot}`);
                player.selectedSlot = 0;
            }
            if(player.hasTag("freeze") && player.selectedSlot !== 0) player.selectedSlot = 0;

        } catch (error) {
            console.error(error, error.stack);
            if(player.hasTag("errorlogger")) player.tell(`§r§6[§aScythe§6]§r There was an error while running the tick event. Please forward this message to https://discord.gg/9m9TbgJ973.\n-------------------------\n${String(error).replace(/"|\\/g, "")}\n${error.stack || "\n"}-------------------------`);
        }
    }
}, 0);
