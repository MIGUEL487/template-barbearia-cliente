import sharp from 'sharp';

const metadata = await sharp('refs/Atlas_UV_de_Textura_para_Maquina_PRO_45.png').metadata();
console.log('Atlas_UV_de_Textura_para_Maquina_PRO_45.png:', metadata);
