"use client"

import CardNav from '../card-nav';
import logo from '../../../../public/images/logo/logo.svg';

const Navbar = () => {
const items = [
  {
    label: "Tentang",
    bgColor: "#0B1240", // refined navy (dari #0D0716)
    textColor: "#F1F5F9",
    links: [
      { label: "Beranda", ariaLabel: "Home" },
      { label: "Tentang Kami", ariaLabel: "About us" }
    ]
  },
  {
    label: "Kontak",
    bgColor: "#131A2F", // refined indigo-navy (dari #170D27)
    textColor: "#F1F5F9",
    links: [
      { label: "Media Sosial", ariaLabel: "Media Social" },
      { label: "Email", ariaLabel: "Email Us" },
      { label: "Nomor", ariaLabel: "Number" }
    ]
  },
  {
    label: "FAQ",
    bgColor: "#1B2440", // refined purple-navy (dari #271E37)
    textColor: "#F8FAFC",
    links: [
      { label: "FAQ", ariaLabel: "FAQ" }
    ]
  },
  
];


  return (
    
   <CardNav
  logo="SarprasTb"
  logoAlt="Company Logo"
  items={items}
  baseColor="#FFF"        
  menuColor="#00008b "        
  buttonBgColor="#1e90ff"    
  buttonTextColor="#FFFFFF"
  ease="power3.out"
/>


  );
};

export default Navbar