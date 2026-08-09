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
    logo:"https://res.cloudinary.com/ohuqxrxy/image/upload/v1785551373/logo_vjcihi.png",
    hero: "https://res.cloudinary.com/ohuqxrxy/image/upload/v1785551372/hero_img_rzx44n.png",
    userAvator:"https://res.cloudinary.com/ohuqxrxy/image/upload/v1785551372/user_lw36xt.png"
};

