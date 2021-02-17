import { data, refresh } from "../data";
import { SBCommand, SBCommandParams } from "../typings/showbie/custom";
import { ranval } from "../utils";

export default {
    base: "Hurts members of kills.json's feelings.",
    det: "Returns a random value for the specified key in kills.json.",
    opts: [{
        name: "name/key",
        base: "The person to kill/key to return from."
    }],
    get: dispatch
} as SBCommand

function dispatch(params: SBCommandParams) {
    return new Promise<string>((_res, _rej) => {
        refresh(["kills"]);
        
        if (params.orig[0].toLowerCase() == "contribute") {
            _res("TODO")
        }
        else if (data.kills[params.orig[0].toLowerCase()])
            _res(ranval(data.kills[params.orig[0].toLowerCase()]));
        
        else _rej("Not Found.");
    })
}