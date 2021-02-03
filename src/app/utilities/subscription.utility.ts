import { Subscription } from 'rxjs';

export class SubscriptionUtility {

    /**
     * @param sub subscription to unsubscribe from and nullify
     */
    public static unsubscribe(sub: Subscription): void {
        if (!!sub) {
            sub.unsubscribe();
            sub = null;
        }
    }
}
