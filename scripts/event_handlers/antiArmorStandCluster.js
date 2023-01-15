import * as Minecraft from "@minecraft/server";
import config from "../data/config";

export function antiArmorStandCluster(entityCreate, debug) {
    const entity = entityCreate.entity;

    if(entity.typeId === "minecraft:armor_stand") {
        const entities = [...entity.dimension.getEntities({
            location: new Minecraft.Location(entity.location.x, entity.location.y, entity.location.z),
            maxDistance: config.misc_modules.antiArmorStandCluster.radius,
            type: "armor_stand"
        })];

        if(entities.length > config.misc_modules.antiArmorStandCluster.max_armor_stand_count) {
            entity.runCommandAsync(`tellraw @a[tag=notify] {
            "rawtext":[{"text":"§r§6[§aScythe§6]§r Potential lag machine detected at X: 
                    ${entity.location.x}, Y: ${entity.location.y}, Z: ${entity.location.z}. 
                    There are ${entities.length}/${config.misc_modules.antiArmorStandCluster.max_armor_stand_count} 
                    armor stands in this area."
                }]}
            `);
            for(const entityLoop of entities) entityLoop.kill();
            return true;
        }
    }
    return false;
}
