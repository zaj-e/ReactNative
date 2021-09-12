import database from '@react-native-firebase/database';
import { urls } from '../common/urls';

export async function processPromises(): Promise<any> {
    const response = await Promise.all(
        urls.map(async url => {
            return await database()
            .ref(url)
            .orderByChild('product_discount')
            .limitToLast(5)
            .once('value');
        })
    );

    let products = {}

    response.forEach((res: any) => {
        products = { ...products, ...res.val()}
    });

    return products;
}