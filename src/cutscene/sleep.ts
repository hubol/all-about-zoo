import {wait} from "./wait";
import {application} from "../igua/game";

export function sleep(ms: number)
{
    let ticksUntilResolve = (ms / 1000) * application.ticker.maxFPS;

    return wait(() => --ticksUntilResolve <= 0);
}
