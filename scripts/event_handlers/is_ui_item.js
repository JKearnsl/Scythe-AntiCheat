import config from "../data/config";
import {mainGui} from "../features/ui";

export function is_ui_item(beforeItemUse, debug) {
    const item = beforeItemUse.item;
    const player = beforeItemUse.source;

    const is_ui_itemId = item.typeId === config.customcommands.ui.ui_item;
    const is_ui_item_name = item.nameTag === config.customcommands.ui.ui_item_name
    // GUI stuff
    if( is_ui_itemId && is_ui_item_name && player.hasTag("op")) { // todo: admincheck
        mainGui(player);
        beforeItemUse.cancel = true;
        return true
    }
    return false
}
