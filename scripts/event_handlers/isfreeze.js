
export function is_freeze(beforeItemUse, debug) {
    const player = beforeItemUse.source;

    // patch bypasses for the freeze system
    if(player.hasTag("freeze")) {
        beforeItemUse.cancel = true;
        return true;
    }
    return false;
}
