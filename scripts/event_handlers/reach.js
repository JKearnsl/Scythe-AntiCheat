import config from "../data/config";
import {flag} from "../util";
import * as Minecraft from "@minecraft/server";

export function reach_a(entityHit, debug) {
    const entity = entityHit.hitEntity;
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return;

    if(typeof entity === "object") {

        // reach/A = check if a player hits an entity more then 5.1 block away

        // get the difference between 2 three dimensional coordinates
        const distance = Math.sqrt(
            Math.pow(entity.location.x - player.location.x, 2) +
            Math.pow(entity.location.y - player.location.y, 2) +
            Math.pow(entity.location.z - player.location.z, 2)
        );
        if (config.debug === true)
            console.warn(`${player.name} attacked ${entity.nameTag || entity.typeId} with a distance of ${distance}`);

        const is_entity_in_blacklist = config.modules.reachA.entities_blacklist.includes(entity.typeId)
        const is_reach_distance = distance > config.modules.reachA.reach

        if (is_reach_distance && entity.typeId.startsWith("minecraft:") && !is_entity_in_blacklist) {
            const checkGmc = Minecraft.World.getPlayers({
                excludeGameModes: [Minecraft.GameMode.creative],
                name: player.name
            });

            if ([...checkGmc].length !== 0) {
                flag(
                    player,
                    "Reach",
                    "A",
                    "Combat",
                    "entity",
                    `${entity.typeId},distance=${distance}`
                );
                return true;
            }
        }
    }
    return false;
}
