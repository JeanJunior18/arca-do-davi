import { BabyAgeStage } from '@/domain/enums/baby-age-stage';
import { GiftCategory } from '@/domain/enums/gift-category';
import { GiftStatus } from '@/domain/enums/gift-status';
import type { GalleryPhoto } from '@/domain/entities/gallery-photo';
import type { GiftItem as GiftItemEntity } from '@/domain/entities/gift-item';
import type { GuestbookMessage } from '@/domain/entities/guestbook-message';

export type GiftItem = Pick<
  GiftItemEntity,
  'id' | 'name' | 'description' | 'imageUrl' | 'category' | 'sizeLabel' | 'quantityNeeded' | 'status'
>;

// Snapshot congelado do Supabase de produção (projeto arca-do-davi) em 2026-07-16,
// depois do evento — site virou recordação estática, sem banco de dados.
export const giftItems: readonly GiftItem[] = [
  {
    id: "30034933-e74c-41ab-a5e0-b6e85ec74115",
    name: "Teclado Infantil Com Microfone Karaokê",
    description: null,
    imageUrl: "/gifts/30034933-e74c-41ab-a5e0-b6e85ec74115.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "09d15545-d24d-424d-a2fb-2445f1a39efe",
    name: "Placa Sensorial De Madeira Montessori",
    description: null,
    imageUrl: "/gifts/09d15545-d24d-424d-a2fb-2445f1a39efe.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "b0ade13f-4e1d-4f0d-8f2e-c96ad96161cc",
    name: "Brinquedo Aramado Divertido Pedagógico",
    description: null,
    imageUrl: "/gifts/b0ade13f-4e1d-4f0d-8f2e-c96ad96161cc.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "aae6b766-abe8-4874-9cd7-e46861e6de7f",
    name: "Painel Sensorial Montessori",
    description: null,
    imageUrl: "/gifts/aae6b766-abe8-4874-9cd7-e46861e6de7f.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "5646bd8c-f4b1-4ee5-a5aa-4d975141a767",
    name: "Minha Primeira Bandinha Kit Musical",
    description: null,
    imageUrl: "/gifts/5646bd8c-f4b1-4ee5-a5aa-4d975141a767.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "06d231fb-61c9-4047-9c94-8ad380664421",
    name: "Tambor Etéreo",
    description: null,
    imageUrl: "/gifts/06d231fb-61c9-4047-9c94-8ad380664421.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "cebda179-6f2e-45a7-b0fe-1fd7764bf2d4",
    name: "Teclado Musical Infantil Casio Casiotone Sa-80 H2",
    description: null,
    imageUrl: "/gifts/cebda179-6f2e-45a7-b0fe-1fd7764bf2d4.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "d19c03b2-2525-4666-8c02-4b251b92f3e7",
    name: "Torre De Aprendizagem Montessori Madeira Mesa Baleia Segura Cor Branco",
    description: null,
    imageUrl: "/gifts/d19c03b2-2525-4666-8c02-4b251b92f3e7.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "36833cf3-df04-44e5-bb49-0b399b24c51a",
    name: "Barraca 3 Em 1 Túnel Menino Foguete Azul Toca Tenda",
    description: null,
    imageUrl: "/gifts/36833cf3-df04-44e5-bb49-0b399b24c51a.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "1eee1386-9fae-4831-9d6f-1219bae959e0",
    name: "Painel Montessori",
    description: null,
    imageUrl: "/gifts/1eee1386-9fae-4831-9d6f-1219bae959e0.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "15cbd4c7-5d4d-49dc-bf24-6a3361ad5af9",
    name: "Kit de Ferramentas",
    description: null,
    imageUrl: "/gifts/15cbd4c7-5d4d-49dc-bf24-6a3361ad5af9.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "5a1f529c-ed33-4b3a-8f6f-9321de4aebd2",
    name: "Blocos De Montar Madeira",
    description: null,
    imageUrl: "/gifts/5a1f529c-ed33-4b3a-8f6f-9321de4aebd2.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "292a1427-3932-4cea-9bb7-f5938ed4ff48",
    name: "Fralda Pampers PANTS XG",
    description: null,
    imageUrl: "/gifts/292a1427-3932-4cea-9bb7-f5938ed4ff48.webp",
    category: GiftCategory.DIAPER_PACK,
    sizeLabel: "XG",
    quantityNeeded: 20,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "7c6cca04-a3d7-402a-8383-61f175d11356",
    name: "Huggies Fralda PANTS XG",
    description: null,
    imageUrl: "/gifts/7c6cca04-a3d7-402a-8383-61f175d11356.webp",
    category: GiftCategory.DIAPER_PACK,
    sizeLabel: "XG",
    quantityNeeded: 20,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "b3e536b2-5a62-407f-b808-af787044a4cb",
    name: "Balde Carrinho De Puxar Com 50 Blocos",
    description: null,
    imageUrl: "/gifts/b3e536b2-5a62-407f-b808-af787044a4cb.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.CLAIMED,
  },
  {
    id: "70be0bc5-7ed4-4305-90ce-e5d4ef31a287",
    name: "Roupas",
    description: "Roupas tamanho 2 anos \r\nO Instagram da loja é Baby Lia Store \r\nWhatsApp 99988249127",
    imageUrl: "/gifts/70be0bc5-7ed4-4305-90ce-e5d4ef31a287.jpeg",
    category: GiftCategory.DIAPER_PACK,
    sizeLabel: null,
    quantityNeeded: 20,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "6956e8fd-d9b1-4b23-a0de-e66974b188e9",
    name: "Playstation 5 para o Davi",
    description: "Hehehe",
    imageUrl: "/gifts/6956e8fd-d9b1-4b23-a0de-e66974b188e9.webp",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.AVAILABLE,
  },
  {
    id: "8bf4d511-57fe-4101-a3da-b765b648f3b5",
    name: "Mesa com cadeira",
    description: "Imagem ilustrativa ",
    imageUrl: "/gifts/8bf4d511-57fe-4101-a3da-b765b648f3b5.jpg",
    category: GiftCategory.REGISTRY_ITEM,
    sizeLabel: null,
    quantityNeeded: 1,
    status: GiftStatus.AVAILABLE,
  }
];

export const guestbookMessages: readonly Pick<GuestbookMessage, 'id' | 'guestName' | 'message'>[] = [
  {
    id: "fe9212a5-5484-423c-ac8b-44c5e207588f",
    guestName: "Jean",
    message: "Eu te amo muito meu filho",
  },
  {
    id: "df3e5a74-cc4e-4caa-8d38-dee427ede172",
    guestName: "Titia Naiany",
    message: "Você é um anjo em nossas vidas, que Deus te abençoe sempre e te faço o melhor servo dele e que você tenha sabedoria, cresça e se torne um homem de fé e muita responsabilidade!! te amo Davizinho e obrigada aos papais do Davi por deixar eu fazer parte da vida dele tão de pertinho ",
  },
  {
    id: "c9221f1c-7d8a-4d1d-8119-0474bbf2bed8",
    guestName: "Ana Denise",
    message: "Você é encantador Davi! Que a cada ano que você completar, você complete sempre dentro do propósito de Cristo para a sua vida.  \r\nAna Denise, te ama, Davi! 🤍",
  },
  {
    id: "f3af1d51-7206-4cf4-8182-9920f0660be2",
    guestName: "Iane Beatriz ",
    message: "Que Deus continue abençoando sua vida, cobrindo de graça e sabedoria, que cada ano você cresça dentro do propósito do Senhor, amo você, pequeno Davi.❤️",
  },
  {
    id: "eb7b835c-51cf-45d1-bb4c-bda5d78eb046",
    guestName: "Mamãe",
    message: "Davi Asher, Vai dormir!",
  },
  {
    id: "4304f357-b05e-46a8-815f-c0a05ebfc71a",
    guestName: "Tia Amanda",
    message: "Davizinho, desejo que você cresça na graça e no conhecimento do Senhor, que Papai do Céu guie cada um dos seus passos e realize os planos dEle na sua vida. \r\n(por favor, não vire baterista)\r\n\r\nVocê é muito amado por mim! Espero continuar fazendo parte de sua vida, e sendo a tia preferida (não invente de me ocultar dos stories futuramente). \r\n\r\nFeliz aniversário, meu pequeno. Que Deus te abençoe grandemente hoje e sempre! \r\n",
  },
  {
    id: "4354d07d-0de5-4494-8b18-f25d7cf3ae46",
    guestName: "Titia Isther ✨🥰",
    message: "Davizinho parece que foi ontem que você chegou ! Desejo que o amor de Jesus e a benção do Senhor estejam SEMPRE sobre sua vida. Que você, a mamãe e o papai continuem amando o Senhor em todo tempo e que cresçam dia após dia na graça Dele. \r\n\r\nTitia ama muito você e se sente muito feliz em estar neste momento com você e sua família, neném risonho e feliz da titia 🥰 Oh modeso do céu ! ✨",
  },
  {
    id: "31fa02f6-4bf7-4dbd-978c-4420056feced",
    guestName: "Titio Mael",
    message: "Que o meu garoto continue alegre como sempre, pois. titio tá muito orgulhoso de saber que você gosta de bateria. Mas tô vendo que tem muito teclado aqui para presente. O que está acontecendo? Acho que teu pai está com malandragem 🤣🤣🥁🥁🥁",
  },
  {
    id: "8058e1d2-a170-452e-8e97-aa83622fb152",
    guestName: "Antonia Moura da Silva ",
    message: "Lindo da titia, te amo meu amorzinho! Que o Senhor te cubra de bênçãos!",
  },
  {
    id: "abf10969-15c5-4871-b358-a0af0d94e136",
    guestName: "Tia Célia ",
    message: "Davi, você desde antes de nascer já era esperado... assumo que perdi a aposta que fiz com o Jean, mas ainda bem que perdi, porque agora temos você, essa preciosidade do Senhor nas nossas vidas, uma criança amada e com certeza muito desejada! Feliz aniversário neném lindu da tia, pode contar comigo sempre que precisar e quando precisar se esconder ou então precisar de alguem que te defenda do teu pai pode me avisar, que a tia aqui briga por você😘 te amo, corra linda!",
  },
  {
    id: "e577f7c5-af38-4959-84de-fabf2d548623",
    guestName: "arcangela ",
    message: "Doce Davi, menino cheio de alegria e simpatia..\r\nVc é  benção,que vc cresça  na presença  do senhor! Deus te livre de todo mal...titia ama sua vida pequeno príncipe ",
  },
  {
    id: "91cc4004-7cb6-46fe-851e-361ede7dffd6",
    guestName: "Shofia",
    message: "Que você continue sendo esse menino brilhante e especial que Deus continue te abençoando sempre ♥️",
  },
  {
    id: "e2379c7e-4d97-4ddc-a19a-60b3a07f4fcc",
    guestName: "Mirelle ",
    message: "Que Deus abençoe cada passo seu, príncipe. Que papai do céu te encha de proteção e todo amor que você precisa. ❤️",
  },
  {
    id: "ff107926-7a84-47eb-abb4-746e9e4100d6",
    guestName: "tio lucas",
    message: "parabéns davi",
  },
  {
    id: "59795d62-b27a-489c-8f76-eac61dfe712a",
    guestName: "Vanessa ",
    message: "\r\nQue Deus abençoe sua vida e que você cresça sempre na graça do Senhor, com saúde, alegria e muito amor. Que Ele guarde cada passo da sua caminhada e faça de você um menino cheio de fé e luz.\r\nTitia Vanessa, ama você Davi!💙",
  },
  {
    id: "c794eb52-64da-4579-84a3-492609701da3",
    guestName: "Carlos Henrique Vulgo: Ie",
    message: "Davi, que Deus abençoe sua vida infinitamente, e, que um dia, você acorde e fale em voz alta para seu pai, eu vou ser baterista, e cumpra o que você disse. Titio te ama muito!",
  }
];

export const galleryPhotos: readonly GalleryPhoto[] = [
  {
    id: "72728744-2179-4fbd-8ab9-7c1558088713",
    ageLabel: BabyAgeStage.NEWBORN,
    imageUrl: "/gallery/72728744-2179-4fbd-8ab9-7c1558088713.jpg",
    displayOrder: 0,
  },
  {
    id: "5376c08b-88a5-4a84-8b41-b009ccf1d564",
    ageLabel: BabyAgeStage.THREE_MONTHS,
    imageUrl: "/gallery/5376c08b-88a5-4a84-8b41-b009ccf1d564.jpg",
    displayOrder: 1,
  },
  {
    id: "5fa6f32e-8d0f-419a-a754-6eb8389612fb",
    ageLabel: BabyAgeStage.SIX_MONTHS,
    imageUrl: "/gallery/5fa6f32e-8d0f-419a-a754-6eb8389612fb.jpg",
    displayOrder: 2,
  },
  {
    id: "d63929d3-d43b-4258-a922-6029b603784d",
    ageLabel: BabyAgeStage.NINE_MONTHS,
    imageUrl: "/gallery/d63929d3-d43b-4258-a922-6029b603784d.jpg",
    displayOrder: 3,
  },
  {
    id: "9243b74a-2817-4bc1-b002-d90cbc42e906",
    ageLabel: BabyAgeStage.ONE_YEAR,
    imageUrl: "/gallery/9243b74a-2817-4bc1-b002-d90cbc42e906.jpg",
    displayOrder: 4,
  }
];
