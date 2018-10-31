import {
    IRadarsuMessage, RadarsuSocket, _,
} from './import';

// collection of radarsuSocket connections
export class RadarsuChannel {
    public constructor(public connections: RadarsuSocket[] = []) {
        //
    }

    public leave(...connections) {
        connections.forEach((connection) => {
            const index = this.connections.indexOf(connection);

            if (index !== -1) {
                this.connections.splice(index, 1);
            }
        });
    }

    public join(...connections) {
        connections.forEach((connection) => {
            if (this.connections.indexOf(connection) === -1) {
                this.connections.push(connection);
            }
        });
    }

    // common
    public async emit(params: IRadarsuMessage) {
        for (const ws of this.connections) {
            await ws.emit(params);
        }
    }
}

const collectConnections = (children: RadarsuChannel[]): RadarsuSocket[] => {
    const arrs = _.map(children, (child: RadarsuChannel) => {
        return child.connections;
    });

    return _.spread(_.union)(arrs) as RadarsuSocket[];
};

export class RadarsuCombinedChannel extends RadarsuChannel {
    public constructor(public children: RadarsuChannel[] = []) {
        super(collectConnections(children));
        this.children = children;
    }

    // public
    public leave(...connections) {
        for (const child of this.children) {
            child.leave(...connections);
        }
    }

    public join(...connections) {
        for (const child of this.children) {
            child.join(...connections);
        }
    }

    // common
    public async emit(params: IRadarsuMessage) {
        for (const ws of this.connections) {
            await ws.emit(params);
        }
    }

    // private
    private refresh() {
        this.connections = collectConnections(this.children);
    }

    private async call(method: string, ...args: any[]) {
        this.refresh();
        for (const ws of this.connections) {
            await ws[method](...args);
        }
    }
}
