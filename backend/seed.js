require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");

const products = [
  { id:"f1", slug:"apple", name:"Apple", brand:"Fresho", weight:"4 pcs", price:199, mrp:240, rating:4.3, ratingCount:8921, image:"/red-royal-gala-apples-fresh.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Apple", description:"Crisp, juicy apples perfect for snacking.", inStock:true },
  { id:"f2", slug:"banana", name:"Banana", brand:"Fresho", weight:"1 kg", price:56, mrp:78, rating:4.3, ratingCount:12453, image:"/fresh-yellow-bananas-bunch-on-white-background.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Banana", description:"Naturally ripened energy-packed bananas.", inStock:true },
  { id:"f3", slug:"orange", name:"Orange", brand:"Fresho", weight:"1 kg", price:189, mrp:220, rating:4.4, ratingCount:3210, image:"/fresh-juicy-oranges-citrus.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Orange", description:"Juicy oranges rich in vitamin C.", inStock:true },
  { id:"f4", slug:"mango", name:"Mango", brand:"Fresho", weight:"1 kg", price:349, mrp:450, rating:4.6, ratingCount:11200, image:"/alphonso-mango-yellow-ripe-premium.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Mango", description:"Sweet and aromatic premium mangoes.", inStock:true },
  { id:"f5", slug:"pineapple", name:"Pineapple", brand:"Fresho", weight:"1 pc", price:79, mrp:110, rating:4.3, ratingCount:18900, image:"/whole-pineapple-tropical-fruit.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Pineapple", description:"Fresh tropical pineapple with juicy golden flesh.", inStock:true },
  { id:"f6", slug:"watermelon", name:"Watermelon", brand:"Fresho", weight:"1 pc", price:99, mrp:125, rating:4.4, ratingCount:11230, image:"/whole-and-sliced-watermelon-red.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Watermelon", description:"Sweet, hydrating red-fleshed watermelon.", inStock:true },
  { id:"f7", slug:"grapes-green-seedless", name:"Grapes - Green Seedless", brand:"Fresho", weight:"500 g", price:129, mrp:160, rating:4.3, ratingCount:3780, image:"/green-seedless-grapes.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Grapes", description:"Fresh crisp green seedless grapes.", inStock:true },
  { id:"f8", slug:"grapes-black", name:"Grapes - Black", brand:"Fresho", weight:"500 g", price:149, mrp:190, rating:4.2, ratingCount:3780, image:"/black-seedless-grapes-bunch-fresh.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Grapes", description:"Juicy sweet-tangy black grapes.", inStock:true },
  { id:"f9", slug:"papaya", name:"Papaya", brand:"Fresho", weight:"1 pc", price:79, mrp:100, rating:4.2, ratingCount:6540, image:"/papaya-fruit-orange-ripe.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Papaya", description:"Fresh semi-ripe papaya with sweet orange flesh.", inStock:true },
  { id:"f10", slug:"pomegranate", name:"Pomegranate", brand:"Fresho", weight:"500 g", price:129, mrp:160, rating:4.5, ratingCount:8760, image:"/fresh-pomegranate-fruit-cut-open.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Pomegranate", description:"Fresh ruby-red pomegranate arils.", inStock:true },
  { id:"f11", slug:"guava", name:"Guava", brand:"Fresho", weight:"500 g", price:149, mrp:190, rating:4.2, ratingCount:5430, image:"/red-guava-fruit-sliced-pink-flesh.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Guava", description:"Fresh guava with soft pink flesh.", inStock:true },
  { id:"f12", slug:"kiwi", name:"Kiwi", brand:"Fresho", weight:"3 pcs", price:149, mrp:210, rating:4.3, ratingCount:3987, image:"/green-kiwi-fruit-sliced-fresh.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Kiwi", description:"Tangy imported green kiwi.", inStock:true },
  { id:"f13", slug:"strawberry", name:"Strawberry", brand:"Fresho", weight:"200 g", price:99, mrp:140, rating:4.0, ratingCount:2134, image:"/red-fresh-strawberries-in-basket.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Berry", description:"Bright sweet fresh strawberries.", inStock:true },
  { id:"f14", slug:"blueberry", name:"Blueberry", brand:"Fresho", weight:"125 g", price:199, mrp:280, rating:4.5, ratingCount:1876, image:"/fresh-blueberries-in-bowl.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Berry", description:"Fresh antioxidant-rich blueberries.", inStock:true },
  { id:"f15", slug:"dragon-fruit", name:"Dragon Fruit", brand:"Fresho", weight:"1 pc", price:199, mrp:250, rating:4.4, ratingCount:2870, image:"/dragon-fruit-pink-exotic-tropical.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Exotic", description:"Fresh pink dragon fruit.", inStock:true },
  { id:"f16", slug:"coconut", name:"Coconut", brand:"Fresho", weight:"1 pc", price:45, mrp:60, rating:4.3, ratingCount:18900, image:"/coconut.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Coconut", description:"Fresh whole coconut.", inStock:true },
  { id:"f17", slug:"sweet-lime", name:"Sweet Lime", brand:"Fresho", weight:"1 kg", price:79, mrp:100, rating:4.0, ratingCount:3210, image:"/sweet-lime-mosambi-green-citrus.jpg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Citrus", description:"Refreshing sweet lime.", inStock:true },
  { id:"f18", slug:"pear", name:"Pear", brand:"Fresho", weight:"4 pcs", price:169, mrp:210, rating:4.2, ratingCount:2650, image:"/pear.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Pear", description:"Fresh crisp sweet pears.", inStock:true },
  { id:"f19", slug:"muskmelon", name:"Muskmelon", brand:"Fresho", weight:"1 pc", price:89, mrp:120, rating:4.2, ratingCount:3220, image:"/muskmelon.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Muskmelon", description:"Sweet aromatic muskmelon.", inStock:true },
  { id:"f20", slug:"jackfruit", name:"Jackfruit", brand:"Fresho", weight:"1 pc", price:149, mrp:190, rating:4.3, ratingCount:2100, image:"/jackfruit.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Jackfruit", description:"Fresh aromatic tropical jackfruit.", inStock:true },
  { id:"f21", slug:"chikoo", name:"Chikoo", brand:"Fresho", weight:"500 g", price:69, mrp:90, rating:4.1, ratingCount:2400, image:"/chikoo.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Chikoo", description:"Naturally sweet ripe chikoo.", inStock:true },
  { id:"f22", slug:"lychee", name:"Lychee", brand:"Fresho", weight:"250 g", price:179, mrp:220, rating:4.4, ratingCount:1980, image:"/lychee.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Lychee", description:"Fragrant juicy lychee.", inStock:true },
  { id:"f23", slug:"peach", name:"Peach", brand:"Fresho", weight:"4 pcs", price:189, mrp:240, rating:4.2, ratingCount:1740, image:"/peach.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Peach", description:"Soft, fragrant fresh peaches.", inStock:true },
  { id:"f24", slug:"plum", name:"Plum", brand:"Fresho", weight:"500 g", price:159, mrp:200, rating:4.2, ratingCount:1660, image:"/plum.svg", deliveryTime:"Tomorrow 7AM", type:"fruit", category:"Plum", description:"Juicy sweet-tart plums.", inStock:true },

  { id:"v1", slug:"tomato", name:"Tomato", brand:"Fresho", weight:"1 kg", price:32, mrp:50, rating:4.1, ratingCount:9821, image:"/red-ripe-tomatoes-fresh.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Tomato", description:"Juicy red tomatoes for curries and salads.", inStock:true },
  { id:"v2", slug:"potato", name:"Potato", brand:"Fresho", weight:"1 kg", price:38, mrp:50, rating:4.2, ratingCount:11234, image:"/fresh-potatoes-brown-skin.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Potato", description:"Fresh potatoes for fries, curries and roasts.", inStock:true },
  { id:"v3", slug:"onion", name:"Onion", brand:"Fresho", weight:"1 kg", price:45, mrp:60, rating:4.0, ratingCount:8421, image:"/fresh-red-onions-on-white.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Onion", description:"Premium red onions.", inStock:true },
  { id:"v4", slug:"carrot", name:"Carrot", brand:"Fresho", weight:"500 g", price:39, mrp:55, rating:4.3, ratingCount:4532, image:"/fresh-orange-carrots-bunch.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Carrot", description:"Crunchy orange carrots rich in beta-carotene.", inStock:true },
  { id:"v5", slug:"cabbage", name:"Cabbage", brand:"Fresho", weight:"1 pc", price:35, mrp:50, rating:4.0, ratingCount:1876, image:"/fresh-green-cabbage-head.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Cabbage", description:"Crisp green cabbage.", inStock:true },
  { id:"v6", slug:"cauliflower", name:"Cauliflower", brand:"Fresho", weight:"1 pc", price:42, mrp:60, rating:4.0, ratingCount:1543, image:"/fresh-white-cauliflower-head.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Cauliflower", description:"Fresh white cauliflower with tight florets.", inStock:true },
  { id:"v7", slug:"broccoli", name:"Broccoli", brand:"Fresho", weight:"250 g", price:89, mrp:120, rating:4.3, ratingCount:2134, image:"/fresh-green-broccoli-florets.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Broccoli", description:"Tender green broccoli florets.", inStock:true },
  { id:"v8", slug:"spinach", name:"Spinach", brand:"Fresho", weight:"250 g", price:19, mrp:30, rating:4.2, ratingCount:3987, image:"/fresh-green-spinach-leaves-palak.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Spinach", description:"Tender iron-rich spinach leaves.", inStock:true },
  { id:"v9", slug:"green-capsicum", name:"Green Capsicum", brand:"Fresho", weight:"500 g", price:49, mrp:70, rating:4.1, ratingCount:2876, image:"/fresh-green-bell-peppers-capsicum.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Capsicum", description:"Crunchy fresh green capsicum.", inStock:true },
  { id:"v10", slug:"red-capsicum", name:"Red Capsicum", brand:"Fresho", weight:"500 g", price:89, mrp:120, rating:4.2, ratingCount:1540, image:"/red-capsicum.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Capsicum", description:"Sweet fresh red capsicum.", inStock:true },
  { id:"v11", slug:"green-chilli", name:"Green Chilli", brand:"Fresho", weight:"100 g", price:25, mrp:35, rating:4.1, ratingCount:2100, image:"/green-chilli.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Chilli", description:"Fresh hot green chillies.", inStock:true },
  { id:"v12", slug:"cucumber", name:"Cucumber", brand:"Fresho", weight:"500 g", price:29, mrp:40, rating:4.1, ratingCount:3210, image:"/fresh-green-cucumber-on-white.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Cucumber", description:"Long crisp fresh cucumber.", inStock:true },
  { id:"v13", slug:"brinjal", name:"Brinjal", brand:"Fresho", weight:"500 g", price:39, mrp:55, rating:3.9, ratingCount:987, image:"/long-purple-brinjal-eggplant-fresh.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Brinjal", description:"Glossy purple brinjal.", inStock:true },
  { id:"v14", slug:"lady-finger", name:"Lady Finger", brand:"Fresho", weight:"250 g", price:35, mrp:50, rating:4.1, ratingCount:2800, image:"/lady-finger.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Lady Finger", description:"Fresh tender lady finger.", inStock:true },
  { id:"v15", slug:"bottle-gourd", name:"Bottle Gourd", brand:"Fresho", weight:"1 pc", price:49, mrp:65, rating:4.0, ratingCount:1900, image:"/bottle-gourd.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Bottle Gourd", description:"Fresh tender bottle gourd.", inStock:true },
  { id:"v16", slug:"bitter-gourd", name:"Bitter Gourd", brand:"Fresho", weight:"500 g", price:45, mrp:60, rating:4.0, ratingCount:1750, image:"/bitter-gourd.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Bitter Gourd", description:"Fresh crisp bitter gourd.", inStock:true },
  { id:"v17", slug:"pumpkin", name:"Pumpkin", brand:"Fresho", weight:"1 kg", price:55, mrp:75, rating:4.1, ratingCount:2200, image:"/pumpkin.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Pumpkin", description:"Fresh sweet orange pumpkin.", inStock:true },
  { id:"v18", slug:"beetroot", name:"Beetroot", brand:"Fresho", weight:"500 g", price:39, mrp:55, rating:4.2, ratingCount:2400, image:"/beetroot.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Beetroot", description:"Fresh earthy beetroot.", inStock:true },
  { id:"v19", slug:"radish", name:"Radish", brand:"Fresho", weight:"500 g", price:29, mrp:40, rating:4.0, ratingCount:1800, image:"/radish.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Radish", description:"Fresh crisp white radish.", inStock:true },
  { id:"v20", slug:"sweet-corn", name:"Sweet Corn", brand:"Fresho", weight:"2 pcs", price:49, mrp:65, rating:4.3, ratingCount:2600, image:"/sweet-corn.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Sweet Corn", description:"Fresh naturally sweet corn.", inStock:true },
  { id:"v21", slug:"green-peas", name:"Green Peas", brand:"Fresho", weight:"500 g", price:59, mrp:80, rating:4.2, ratingCount:2500, image:"/green-peas.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Green Peas", description:"Fresh sweet green peas.", inStock:true },
  { id:"v22", slug:"french-beans", name:"French Beans", brand:"Fresho", weight:"250 g", price:45, mrp:60, rating:4.2, ratingCount:1432, image:"/fresh-green-french-beans.jpg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"French Beans", description:"Crisp tender French beans.", inStock:true },
  { id:"v23", slug:"drumstick", name:"Drumstick", brand:"Fresho", weight:"250 g", price:39, mrp:55, rating:4.1, ratingCount:1300, image:"/drumstick.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Drumstick", description:"Fresh long drumsticks.", inStock:true },
  { id:"v24", slug:"sweet-potato", name:"Sweet Potato", brand:"Fresho", weight:"500 g", price:49, mrp:65, rating:4.1, ratingCount:6230, image:"/sweet-potato.svg", deliveryTime:"Tomorrow 7AM", type:"vegetable", category:"Sweet Potato", description:"Naturally sweet nutritious sweet potatoes.", inStock:true },
];

const seed = async () => {
  await connectDB();
  if (mongoose.connection.readyState !== 1) {
    console.error("Database unavailable; no product reset or deletion was performed");
    return;
  }

  for (const product of products) {
    await Product.updateOne(
      { $or: [{ id: product.id }, { slug: product.slug }] },
      { $set: product },
      { upsert: true }
    );
  }

  const all = await Product.find({});
  const keptIds = new Set();
  for (const product of products) {
    const canonical = all.find((item) =>
      item.slug === product.slug ||
      String(item.name).trim().toLowerCase() === product.name.trim().toLowerCase()
    );
    if (canonical) keptIds.add(String(canonical._id));
  }

  const groups = new Map();
  for (const item of all) {
    const key = `${item.type}:${String(item.name).trim().toLowerCase()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const canonical = group.find((item) => keptIds.has(String(item._id))) || group[0];
    const duplicateIds = group
      .filter((item) => String(item._id) !== String(canonical._id))
      .map((item) => item._id);
    if (duplicateIds.length) await Product.deleteMany({ _id: { $in: duplicateIds } });
  }

  const userExists = await User.findOne({ email: "admin@freshbasket.com" });
  if (!userExists) {
    await User.create({ name:"Admin", email:"admin@freshbasket.com", password:"admin123", role:"admin" });
  }

  console.log(`Seeded or updated ${products.length} unique catalog products`);
  await mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
