import { categories, groupCategories, prefix, subCategories } from "./contants";

export const urls = [
    `${prefix}products/${groupCategories.TECNOLOGIA}/${categories.COMPUTADORAS}/${subCategories.LAPTOPS}`,
    `${prefix}products/${groupCategories.TECNOLOGIA}/${categories.TELEVISORES}/${subCategories.OLED}`,
    `${prefix}products/${groupCategories.TECNOLOGIA}/${categories.TELEVISORES}/${subCategories.QLED}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.COCINA}/${subCategories.COCINA_DE_PIE}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.LAVADO}/${subCategories.LAVADORAS}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.LAVADO}/${subCategories.SECADORAS}`,
    `${prefix}products/${groupCategories.ELECTROHOGAR}/${categories.REFRIGERACION}/${subCategories.REFIGERADORAS}`,
]