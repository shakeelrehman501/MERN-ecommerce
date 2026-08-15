import { LuLinkedin, LuFacebook } from "react-icons/lu";
import { GrInstagram } from "react-icons/gr";
import { FiGithub } from "react-icons/fi";

export const BASE_URL = "http://localhost:8000/api/v1";

export const socialLinks = [
  {
    name: "Facebook",
    icon: LuFacebook,
    href: "https://github.com/shakeelrehman501/Portfolio",
  },
  {
    name: "Github",
    icon: FiGithub,
    href: "https://github.com/shakeelrehman501/Portfolio",
  },
  {
    name: "https://www.linkedin.com/in/shakeel-rehman-332339251/",
    icon: LuLinkedin,
    href: "#",
  },
  {
    name: "Instagram",
    icon: GrInstagram,
    href: "https://www.linkedin.com/in/shakeel-rehman-332339251/",
  },
];

export const Images = {
  logo: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1785551373/logo_vjcihi.png",
  hero: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1785551372/hero_img_rzx44n.png",
  userAvator:
    "https://res.cloudinary.com/ohuqxrxy/image/upload/v1785551372/user_lw36xt.png",
};

export const ShopImg = [
  {
    name: "Mobile",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786790164/mobiles_f4oe0d.jpg",
  },
  {
    name: "Laptop",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786789840/laptop-2_ql3hcr.jpg",
  },
  {
    name: "Watch",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786789789/watch_02_v2ebdr.jpg",
  },
  {
    name: "Keyboard",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786790483/keyboard_5_ifo7sk.jpg",
  },
  {
    name: "Headphone",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786789791/headphone_02_ogdeoc.jpg",
  },
  {
    name: "Mouse",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786789789/mouse_2_uokdfx.jpg",
  },
];

export const newArrival = [
  {
    id:1,
    name: "Daniel Hechter Paris Rivoli Collection Modern Analog Watch for Men with Octagon Dial and Silicon Band-DHM1003",
    price: "50300",
    brand: "Apple",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786795193/watch_03_k0od3a.jpg",
  },
  {
    id:2,
    name: `DELL 15 (2025) Intel Core i3 13th Gen 1315U - (8 GB/512 GB SSD/Intel UHD Graphics/Windows 11 Home) Thin and Light Business Laptop/15.6" HD Display/Smoky Black/1.5 kg/MSO 2021/1 Year ADP Warranty`,
    price: "6000",
    brand: "Daniel Hechter",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786795194/laptop_3_vyod95.jpg",
  },
  {
    id:3,
    name: "Beats Solo 4 - Wireless On-Ear Bluetooth Headphones, Up to 50-Hour Battery Life, Ultra-Lightweight Comfort, Powerful and Balanced Sound, Apple & Android Compatible - Matte Black",
    price: "18400",
    brand: "pTron",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786795198/headphone_03_dmir9k.jpg",
  },
  {
    id:4,
    name: "Rapoo MT760L Ergonomic MultiDevice Mouse, Rechargeable, Onboard Memory, Blk | M+ CrossScreen Transmission, 1+10 Custom Buttons, 50-4000DPI, Connects 5 Devices, 2 USB Dongles, 800mAh Battery, Side Scroll",
    price: "7000",
    brand: "Rapoo",
    img: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1786795196/mouse_five_monu8v.jpg",
  },
];

export const reviews = [
    { name: 'Ayesha Khan', city: 'Lahore', rating: 5, text: 'Super fast delivery and unbeatable prices. Got my AirPods in perfect condition!', avatar: '👩' },
    { name: 'Bilal Siddiqui', city: 'Karachi', rating: 5, text: 'Bought my MacBook Air during the flash sale. Smooth experience from start to finish.', avatar: '👨' },
    { name: 'Sara Malik', city: 'Islamabad', rating: 4, text: 'Great product range and helpful support team. My watch arrived perfectly packaged.', avatar: '👩‍💼' },
  ]