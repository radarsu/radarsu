import {
    RadarsuController, RadarsuMiddleware, RadarsuSocket, exampleGuard, exampleMiddleware,
} from '../import';

@RadarsuController
@RadarsuMiddleware(exampleMiddleware, exampleGuard)
export class ExampleController {

    public method(rs: RadarsuSocket) {
        return 'OK';
    }
}
