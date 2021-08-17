import database from '@react-native-firebase/database';
import { categories, groupCategories, prefix, subCategories } from "../common/contants";

const urls = [
    `${prefix}products/${groupCategories.TECNOLOGIA}/${categories.COMPUTADORAS}/${subCategories.LAPTOPS}`,
    `${prefix}products/${groupCategories.TECNOLOGIA}/${categories.TELEVISORES}/${subCategories.OLED}`,
    `${prefix}products/${groupCategories.TECNOLOGIA}/${categories.TELEVISORES}/${subCategories.QLED}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.COCINA}/${subCategories.COCINA_DE_PIE}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.LAVADO}/${subCategories.LAVADORAS}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.LAVADO}/${subCategories.SECADORAS}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.REFRIGERACION}/${subCategories.REFRIGERADORAS}`,
]

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