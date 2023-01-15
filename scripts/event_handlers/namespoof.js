import config from "../data/config";

export function namespoof_a(event_obj, debug) {
    const player = event_obj.player;

    // Namespoof/A = username length check.

    // check if 2 players are logged in with the same name
    // minecraft adds a suffix to the end of the name which we detect

    const max_name_length = config.modules.namespoofA.maxNameLength
    const min_name_length = config.modules.namespoofA.minNameLength

    const name_is_big = player.name.length > max_name_length;
    const name_is_small = player.name.length < min_name_length;

    if(player.name.endsWith(')') && (player.name.length > max_name_length + 3 || name_is_small ))
        player.flagNamespoofA = true;

    if(!player.name.endsWith(')') && (name_is_small || name_is_big))
        player.flagNamespoofA = true;

    if(player.flagNamespoofA) {
        const extraLength = player.name.length - max_name_length;
        player.nameTag = player.name.slice(0, -extraLength) + "...";
        return true;
    }
    return false;
}

export function namespoof_b(event_obj, debug) {
    const player = event_obj.player;

    // Namespoof/B = regex check
    if(config.modules.namespoofB.regex.test(player.name)){
        player.flagNamespoofB = true;
        return true;
    }
    return false;
}

export function namespoof_c(event_obj, debug) {
    const player = event_obj.player;
    let foundName;

    player.getTags().forEach(t => {
        // Namespoof/C
        // adding a double qoute makes it so commands cant remove the tag, and cant add the tag to other people
        if(t.startsWith("\"name:\n"))
            foundName = t.replace("\"name:\n", "");

        // load custom nametag
        if(t.includes("tag:")) {
            t = t.replace(/"|\\/g, "");
            player.nameTag = `§8[§r${t.slice(4)}§8]§r ${player.name}`;
        }
    });


    if(typeof foundName === "undefined") {
        player.addTag(`"name:\n${player.name}`);
    } else if(foundName !== player.name) {
        player.flagNamespoofC = true;
        player.oldName = foundName;
        return true;
    }
    return false;
}
