import config from "../data/config";
import {playerSettingsMenuSelected} from "../features/ui";

export function playerWasHitWithUI(entityHit) {
    const entity = entityHit.hitEntity;
    const player = entityHit.entity;

    if(player.typeId !== "minecraft:player") return false;
    // TODO: add a check if admin

    // check if the player was hit with the UI item, and if so open the UI for that player

    const container = player.getComponent("inventory").container;

    const item = container.getItem(player.selectedSlot);
    const is_custom_ui_item = item?.typeId === config.customcommands.ui.ui_item
    const is_player = entity.typeId === "minecraft:player"

    if( is_player && is_custom_ui_item && item?.nameTag === config.customcommands.ui.ui_item_name) {
        playerSettingsMenuSelected(player, entity);
    }
}