//
// I didn't bother integrating the "Minecraft.world.event" built-in handler into this router
// because I think it's wrong, although you can. If we combine this, then the code in main.js
// will be reduced and these functions can be made much more optimized, because it will be possible
// to use unsubscribe field of Minecraft.world.event
//
// This router allows you to manipulate checks while the program is running, i.e. you can free up some config
//
export default  class ChecksRouter
{
    constructor(is_debug = false) {
        this._is_debug = is_debug;
    }


    _blockPlace = [];
    _blockBreak = [];
    _beforeItemUseOn = [];
    _playerSpawn = [];
    _entitySpawn = [];
    _entityHit = [];
    _beforeItemUse = [];
    _entityHurt = [];
    _beforeChat = [];


    _getEventHandlers(event_name){
        switch(event_name)
        {
            case "blockPlace":
                return this._blockPlace;
            case "blockBreak":
                return this._blockBreak;
            case "beforeItemUseOn":
                return this._beforeItemUseOn;
            case "playerSpawn":
                return this._playerSpawn;
            case "entitySpawn":
                return this._entitySpawn;
            case "entityHit":
                return this._entityHit;
            case "beforeItemUse":
                return this._beforeItemUse;
            case "entityHurt":
                return this._entityHurt;
            case "beforeChat":
                return this._beforeChat;
            default:
                throw new Error("Unknown event name: " + event_name);
        }
    }


    registerEvent(event_name, handler) {
        let event_handlers = this._getEventHandlers(event_name);
        event_handlers.push(handler);
    }

    unregisterEvent(event_name, handler) {
        let event_handlers = this._getEventHandlers(event_name);
        let index = event_handlers.indexOf(handler);
        if (index > -1) {
            event_handlers.splice(index, 1);
        }
    }

    execute(event_name, event_obj) {
        let event_handlers = this._getEventHandlers(event_name);
        for (let i = 0; i < event_handlers.length; i++) {
            let is_bad = event_handlers[i](event_obj)
            if (is_bad) {
                return false;
            }
        }
        return true;
    }
}
