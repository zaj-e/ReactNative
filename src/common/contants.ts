export const prefix = '/';
export const groupCategories = {
  TECNOLOGIA: 'tecnologia',
  ELECTROHOGAR: 'electrohogar',
};
export const categories = {
  COMPUTADORAS: 'computadoras',
  TELEVISORES: 'televisores',
  COCINA: 'cocina',
  LAVADO: 'lavado', 
  REFRIGERACION: 'refrigeracion',
};
export const subCategories = {
  LAPTOPS: 'laptops',
  OLED: 'oled',
  QLED: 'qled',
  COCINA_DE_PIE: 'cocina de pie',
  LAVADORAS: 'lavadoras',
  SECADORAS: 'secadoras',
  REFIGERADORAS: 'refigeradoras',
};
export const DEFAULT_USER =
  'https://www.google.com/search?q=user+png&rlz=1C5CHFA_enPE939PE939&sxsrf=ALeKk01zFs2OqR73h34ljX__u2muproZxw:1625781111017&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjo7-rMutTxAhWppZUCHe0IBXQQ_AUoAXoECAEQAw&biw=1440&bih=764#imgrc=QE3OQDJuT9zyvM';

export const groupCategoriesData = {
  TECNOLOGIA: {
    urlImg:
      'https://img.freepik.com/foto-gratis/dispositivos-e-iconos-tecnologicos-conectados-al-planeta-tierra-digital_117023-449.jpg?size=626&ext=jpg',
    text: 'Tecnnología',
    identifier: 'tecnologia'
  },
  ELECTROHOGAR: {
    urlImg:
      'https://technopatas.b-cdn.net/wp-content/uploads/img-lumingo-mobile-3.jpg',
    text: 'ElectroHogar',
    identifier: 'electrohogar'
  },
};

export const categoriesData = {
  COMPUTADORAS: {
    urlImg:
      'https://www.loyvan.com/wp-content/uploads/2014/09/clases-de-computadoras.jpg',
    text: 'Computadoras',
    parent: 'tecnologia',
    identifier: 'computadoras'
  },
  TELEVISORES: {
    urlImg:
      'https://www.falabella.com.pe/static/RDF/site/landing/guiacompra/gc-televisores/assets/img/heromob.jpg?vid4',
    text: 'Televisores',
    parent: 'tecnologia',
    identifier: 'televisores'
  },
  COCINA: {
    urlImg:
      'https://www.hola.com/imagenes/decoracion/20200325164009/decoracion-cocinas-modernas-color/0-802-939/cocinas-color-9a-a.jpg',
    text: 'Cocinas',
    parent: 'electrohogar',
    identifier: 'cocina'
  },
  LAVADO: {
    urlImg:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnfOi5xG4tqF54ZESS-zvzow5sRxfP-LYYtA&usqp=CAU',
    text: 'Lavado',
    parent: 'electrohogar',
    identifier: 'lavado'
  },
  REFRIGERACION: {
    urlImg:
      'https://img.global.news.samsung.com/pe/wp-content/uploads/2020/05/portada-refrigeradora.jpg',
    text: 'Refrigeración',
    parent: 'electrohogar',
    identifier: 'refrigeracion'
  },
};

export const subCategoriesData = {
  LAPTOPS: {
    urlImg:
      'https://www.hp.com/lamerica_nsc_cnt_amer-es/images/composite_elite2_desktop_tcm237_2389515_tcm237_2193389_tcm237-2389515.jpg',
    text: 'Laptops',
    parent: 'computadoras'
  },
  OLED: {
    urlImg:
      'https://img.blogs.es/tecnologialg/wp-content/uploads/2019/01/LG-OLED.jpg',
    text: 'OLED',
    parent: 'televisores'
  },
  QLED: {
    urlImg:
      'https://hiraoka.com.pe/media/mageplaza/blog/post/o/l/oled-qled-televisores_.jpg',
    text: 'QLED',
    parent: 'televisores'
  },
  COCINA_DE_PIE: {
    urlImg:
      'https://p0.piqsels.com/preview/819/716/862/person-human-room-indoors.jpg',
    text: 'Cocina de pie',
    parent: 'cocina'
  },
  SECADORAS: {
    urlImg:
      'https://www.ecestaticos.com/image/clipping/c49e6b4c66d395b94213ede6c8e78980/las-mejores-secadoras-del-mercado-y-las-mas-valoradas-por-los-usuarios.jpg',
    text: 'Secadoras',
    parent: 'lavado'
  },
  LAVADORAS: {
    urlImg:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZAJW7PwEs_af6P8HGQMfBPzkrLPadvldsr4s11vlAHa3pEZgFq_MEGdXho0kyz7lsl6A&usqp=CAU',
    text: 'Lavadoras',
    parent: 'lavado'
  },
  REFIGERADORAS: {
    urlImg:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxp0YF9Z3X_AMFzNUTXaIUpLwNoBNm1Y7nig&usqp=CAU',
    text: 'Refigeradoras',
    parent: 'refrigeracion'
  }
}
