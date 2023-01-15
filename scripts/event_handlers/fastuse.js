import config from "../data/config";
import {flag} from "../util";

export function fastuse_a(beforeItemUse, debug) {
    const player = beforeItemUse.source;

    const lastThrowTime = Date.now() - player.lastThrow;
    if(lastThrowTime > config.modules.fastuseA.min_use_delay && lastThrowTime < config.modules.fastuseA.max_use_delay) {
        flag(player, "FastUse", "A", "Combat", "lastThrowTime", lastThrowTime);
        beforeItemUse.cancel = true;
        return true
    }
    player.lastThrow = Date.now();
    return false
}