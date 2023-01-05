import data from "../data/data";

export function itemSpawnRateLimit(entityCreate, debug) {
    const entity = entityCreate.entity;

    data.entitiesSpawnedInLastTick++;

    if(data.entitiesSpawnedInLastTick > config.modules.itemSpawnRateLimit.entitiesBeforeRateLimit) {
        if(debug)
            console.warn(`Killed "${entity.typeId}" due to entity spawn ratelimit reached.`);
        entity.kill();
        return true;
    }
    return false;
}
