import { FuseUtils } from '@fuse/utils';

export class Prediction {
    id: string;
    reference: string;
    subtotal: string;
    tax: string;
    discount: string;
    total: string;
    date: string;
    customer: any;
    products: any[];
    status: any[];
    payment: any;
    shippingDetails: any[];

    /**
     * Constructor
     *
     * @param prediction
     */
    constructor(prediction?) {
        prediction = prediction || {};
        this.id = prediction.id || FuseUtils.generateGUID();
        this.reference = prediction.reference || FuseUtils.generateGUID();
        this.subtotal = prediction.subtotal || 0;
        this.tax = prediction.tax || 0;
        this.discount = prediction.discount || 0;
        this.total = prediction.total || 0;
        this.date = prediction.date || '';
        this.customer = prediction.customer || {};
        this.products = prediction.products || [];
        this.status = prediction.status || [];
        this.payment = prediction.payment || {};
        this.shippingDetails = prediction.shippingDetails || [];
    }
}
