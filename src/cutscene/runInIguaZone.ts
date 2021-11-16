import {AsshatTicker} from "../utils/asshatTicker";
import {application} from "../igua/game";
import {CancellationToken} from "../utils/pissant/cancellationToken";

export type PromiseFn = () => Promise<unknown>;

interface Properties {
    cancellationToken: CancellationToken;
    ticker: AsshatTicker;
}

export function runInIguaZone(name: string, promiseFn: PromiseFn, properties: Properties) {
    return new Promise<void>((resolve, reject) => {
        const zone = Zone.root.fork({ name, properties});
        zone.run(() => promiseFn().then(resolve as any).catch(reject));
    })
}

export const IguaZone = {
    get cancellationToken(): CancellationToken | undefined {
        return Zone.current.get('cancellationToken');
    },
    get ticker(): AsshatTicker {
        return Zone.current.get('ticker') ?? application.stage.ticker;
    }
}
