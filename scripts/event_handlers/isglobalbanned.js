import {banList} from "../data/globalban";

export function is_global_banned(event_obj, debug) {
    const player = event_obj.player;
    if(banList.includes(player.name.toLowerCase()) || banList.includes(player.oldName?.toLowerCase())) {
        player.isGlobalBanned = true;
        return true;
    }
    return false;
}
